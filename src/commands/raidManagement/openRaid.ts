import { EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { verifyRaidExists } from '../../services/verification/raidVerification';
import { verifyBotChannel } from '../../services/verification/channelVerification';
import {
	findRaid, openRaid as openRaidDb,
	saveInfoMessage,
	saveRaidChannelId,
	saveRosterMessage, saveThreadId,
} from '../../database/dataRepository/raidRepository';
import { findRaidSettings, getRaidEmoji } from '../../database/dataRepository/raidSettingsRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { convertToUnixTime } from '../../services/dateHelpers/dateFormater';
import { IRaidSettingsInstance } from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes';
import { saveRoster } from '../../database/dataRepository/rosterRepository';
import { editRosterMessage } from '../../services/messageServices/editRaidMessage';
import { findTier } from '../../database/dataRepository/tierRepository';
import RaidManager from '../../services/raidServices/raidManager';
import raidEmoji from '../../database/models/raidEmoji';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open')
		.setDescription('Opens raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('Name of the raid')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			console.log('interaction type' + typeof interaction);
			const { guild, guildId, channel, options } = interaction;
			const raidName = options.getString('raid_name');

			const checkBotChannel = await verifyBotChannel(guildId, channel.id);

			if (!checkBotChannel) {
				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
				return;
			}

			const checkRaidExists = await verifyRaidExists(guildId, raidName);
			console.log(checkRaidExists);

			if (!checkRaidExists) {
				interaction.reply({ content: `Raid named ${raidName} does not exist`, ephemeral: true });
				return;
			}

			const raidSettings = await findRaidSettings(guildId);

			if (raidSettings?.raidChannelGroup === null) {
				await interaction.reply({ content: 'Please set the channel group for the raid channels', ephemeral: true });
				return;
			}

			const raid = await findRaid(guildId, raidName) as IRaidInstance;

			const getTier = await findTier(guildId, raid.raidTier as string);
			let restrictedTier: string | null = null;

			if (getTier?.isRestricted) {
				console.log('tier is restricted');
				// find role id
				restrictedTier = await guild.roles.cache.find((role:any) => role.name === getTier.roleName[0]);
			}

			const channelCreate = await RaidManager.openRaid(raid, raidSettings as IRaidSettingsInstance, guild, restrictedTier);

			const saveChannel = await saveRaidChannelId(guildId, raidName, channelCreate.id);

			if (!saveChannel) {
				await interaction.reply({ content: 'unable to save the channel id', ephemeral: true });
				return;
			}

			const infoEmbed = new EmbedBuilder()
				.setTitle('Raid Info');

			if (raid?.raidLead != null) {
				const user = await guild.members.cache.find((member:any) => member.user.username === raid.raidLead);
				infoEmbed.addFields({ name: '\n__Raid Lead__:', value: `<@${user.id}>` });
			}

			if (raid?.info != null) {
				infoEmbed.addFields({ name: '__Raid Info__:', value: raid.info });
			}

			if (raid?.raidDateTime != null) {
				const convertDate = convertToUnixTime(raid.raidDateTime).toString();
				infoEmbed.addFields({ name: '__Local Raid Time__:', value:`<t:${convertDate}>` });
			}

			if (raid.id != null) {
				const createRoster = await saveRoster(raid.id, raidName);

				if (createRoster === null) {
					console.log('Unable to create main roster');
				}
			}

			await channelCreate.send('@everyone');
			const infoMsg = await channelCreate.send({ embeds: [ infoEmbed ] });
			const getEmoji = await getRaidEmoji(raidSettings?.id as number);

			if (getEmoji === null || getEmoji === undefined) {
				interaction.reply({ content: 'unable to get emoji', ephemeral: true });
				return;
			}

			const rosterMsg = await channelCreate.send({ embeds: [ editRosterMessage(' ', ' ', [0, 0, 0], 'no signups', '') ] });

			await saveInfoMessage(guildId, raidName, infoMsg.id);
			await saveRosterMessage(guildId, raidName, rosterMsg.id);

			const raidChannelThread = await channelCreate.threads.create({
				name: `${raidName} discussion`,
				autoArchiveDuration: 60,
				reason: 'Thread for raid discussions',
			});

			getEmoji?.forEach(e => {
				rosterMsg.react(e.emoji);
			});

			await saveThreadId(guildId, raidName, raidChannelThread.id);
			await openRaidDb(guildId, raidName);

			await raidChannelThread.send('Discussion thread for the raid, please keep all discussions here.');

			await interaction.reply({ content: `Raid ${raidName} has been opened`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running this command', err);
			interaction.reply('there was an issue running this command, contact support for assistance');
		}
	},
};