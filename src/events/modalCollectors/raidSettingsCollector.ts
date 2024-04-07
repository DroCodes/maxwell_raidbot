import { Events, User } from 'discord.js';
import { verifyRaidExists } from '../../services/verification/raidVerification';
import {
	findRaid,
	saveRaidDate,
	saveRaidLead,
	saveRaidRoles,
	saveRaidTier,
} from '../../database/dataRepository/raidRepository';
import { convertToUnixTime, parseDate } from '../../services/dateHelpers/dateFormater';
import { verifyTierExists } from '../../services/verification/tierVerification';
import { editInfoMessage } from '../../services/messageHelpers/editInfoMessage';

module.exports = {
	// TODO: Add db field to store raid status (open, closed, in progress)
	name: Events.InteractionCreate,

	message: '',

	async execute(interaction: any) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId === 'allSettings') {
			const { guildId, guild } = interaction;

			const raidName = interaction.fields.getTextInputValue('raidName');
			const raidLead = interaction.fields.getTextInputValue('raidLead');
			const raidDate = interaction.fields.getTextInputValue('date');
			const raidTier = interaction.fields.getTextInputValue('tier');
			const raidRoles = interaction.fields.getTextInputValue('roles');

			console.log(typeof raidDate);


			const verifyRaid = await verifyRaidExists(guildId, raidName);

			if (!verifyRaid) {
				await interaction.reply({ content: 'raid doesn\'t exists', ephemeral: true });
				return;
			}

			const raid = await findRaid(guildId, raidName);

			if (raidLead !== '') {
				const findUser = await interaction.client.users.cache.find((user: User) => user.username === raidLead);

				if (findUser) {
					const saveLead = await saveRaidLead(guildId, raidName, raidLead);

					if (!saveLead) {
						this.message += `unable to save raid lead: ${raidLead}\n`;
					}
					else {
						this.message += `Raid lead saved as: ${raidLead}\n`;
					}
				}
				else {
					this.message += `unable to find user: ${raidLead}\n`;
				}
			}
			else {
				this.message += 'no raid lead provided\n';
			}

			if (raidDate !== '') {
				const convertDate = parseDate(raidDate);
				const saveDate = saveRaidDate(guildId, raidName, convertDate);
				const unixDate = convertToUnixTime(convertDate).toString();

				if (!saveDate) {
					this.message += `unable to save date: ${raidDate}, make sure it is formatted correctly mm-dd hh:mm\n`;
				}
				else {
					this.message += `Raid date saved as: <t:${unixDate}>\n`;
				}
			}
			else {
				this.message += 'no raid date provided\n';
			}

			if (raidTier !== '') {
				const checkTierExists = await verifyTierExists(guildId, raidTier);

				if (checkTierExists) {
					const saveTier = await saveRaidTier(guildId, raidName, raidTier);

					if (!saveTier) {
						this.message += `unable to save tier: ${raidTier}\n`;
					}
					else {
						this.message += `Raid tier saved as: ${raidTier}\n`;
					}
				}
				else {
					this.message += `unable to find tier: ${raidTier}\n`;
				}
			}
			else {
				this.message += 'no raid tier provided\n';
			}

			if (raidRoles !== '') {
				const rolesSplit: string[] = raidRoles.split(' ');
				let isValidRole = true;
				for (const r of rolesSplit) {
					if (isNaN(Number(r))) {
						isValidRole = false;
						break;
					}
				}

				if (!isValidRole) {
					this.message += 'invalid roles, please ensure you enter a number for each role e.g. 2 2 8\n';
				}
				else {
					const saveRoles = await saveRaidRoles(guildId, raidName, rolesSplit);

					if (!saveRoles) {
						this.message += `unable to save roles: ${rolesSplit}\n`;
						return;
					}
					else {
						this.message += `Raid roles saved as Tank: ${rolesSplit[0]}, Healer: ${rolesSplit[1]}, DPS: ${rolesSplit[2]} \n`;
					}
				}
			}
			else {
				this.message += 'no raid roles provided\n';
			}

			if (raid?.isOpen) {
				const user = await guild.members.cache.find((member:any) => member.user.username === raid?.raidLead);
				const info = { raidMessage: raid?.info, raidTime: `<t:${convertToUnixTime(<Date>raid?.raidDateTime).toString()}>`, raidLeader: `<@${user.id}>` };
				const channel = await interaction.guild.channels.fetch(raid?.raidChannelId);

				if (channel) {
					const targetMessage = await channel.messages.fetch(raid?.infoMsgId);
					const edit = editInfoMessage(info);

					await targetMessage.edit({ embeds: [edit] });
				}
			}

			await interaction.reply({ content: this.message, ephemeral: true });
			this.message = '';
		}
	},
};