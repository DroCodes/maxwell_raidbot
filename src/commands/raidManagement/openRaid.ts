import { EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { verifyRaidExists } from '../../lib/verification/raidVerification';
import { verifyBotChannel } from '../../lib/verification/channelVerification';
import {
	findRaid,
	saveInfoMessage,
	saveRaidChannelId,
	saveRosterMessage,
} from '../../database/dataRepository/raidRepository';
import { findRaidSettings, getRaidEmoji } from '../../database/dataRepository/raidSettingsRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { convertToUnixTime } from '../../lib/dateHelpers/dateFormater';
import raidEmoji from '../../database/models/raidEmoji';
import { IRaidSettingsInstance } from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes';
import { saveRoster } from '../../database/dataRepository/rosterRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('open')
		.setDescription('Opens raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('Name of the raid')
				.setRequired(true)),

	isDevelopment: true,

	async execute(interaction: any) {
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

		const channelCreate = await guild.channels.create({
			name: raidName,
			parent: raidSettings?.raidChannelGroup,
		});

		const saveChannel = await saveRaidChannelId(guildId, raidName, channelCreate.id);

		if (!saveChannel) {
			await interaction.reply({ content: 'unable to save the channel id', ephemeral: true });
			return;
		}

		const infoEmbed = new EmbedBuilder()
			.setTitle(raidName);

		if (raid?.info != null) {
			infoEmbed.addFields({ name: 'Raid Info:', value: raid.info });
		}

		if (raid?.raidDateTime != null) {
			const convertDate = convertToUnixTime(raid.raidDateTime).toString();
			infoEmbed.addFields({ name: 'Raid Info:', value:`<t:${convertDate}>` });
		}

		if (raid.id != null) {
			const createRoster = await saveRoster(raid.id, raidName);

			if (createRoster === null) {
				// interaction.reply({ content: 'Unable to create roster, please try again', ephemeral: true });
				console.log('Unable to create main roster');
			}
		}

		const rosterEmbed = new EmbedBuilder()
			.setTitle('Roster:');

		rosterEmbed.addFields({ name: 'raider, emoji', value: 'raid message', inline: true });
		rosterEmbed.addFields({ name: '__Counts By Roles:__', value: 'TANK:\n' +
				'HEALER:\n' +
				'DPS\n' });

		await channelCreate.send('@everyone');
		const infoMsg = await channelCreate.send({ embeds: [ infoEmbed ] });
		const rosterMsg = await channelCreate.send({ embeds: [ rosterEmbed ] });

		await saveInfoMessage(guildId, raidName, infoMsg.id);
		await saveRosterMessage(guildId, raidName, rosterMsg.id);

		const raidChannelThread = await channelCreate.threads.create({
			name: `${raidName} discussion`,
			autoArchiveDuration: 60,
			reason: 'Thread for raid discussions',
		});

		const getEmoji = await getRaidEmoji(raidSettings?.id as number);

		if (getEmoji === null) {
			interaction.reply({ content: 'unable to get emoji', ephemeral: true });
		}

		getEmoji?.forEach(e => {
			rosterMsg.react(e.emoji);
		});

		raidChannelThread.send('Thread message');

		await interaction.reply(`new channel ${channelCreate.name}`);
	},
};