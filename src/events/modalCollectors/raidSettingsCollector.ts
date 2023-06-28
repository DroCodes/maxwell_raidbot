import { Events, User } from 'discord.js';
import { verifyRaidExists } from '../../lib/verification/raidVerification';
import {
	saveRaidDate,
	saveRaidLead,
	saveRaidRoles,
	saveRaidTier,
} from '../../database/dataRepository/raidRepository';
import { convertToUTC } from '../../lib/dateHelpers/dateFormater';
import { verifyTierExists } from '../../lib/verification/tierVerification';

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction: any) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId === 'allSettings') {
			const { guildId } = interaction;

			const raidName = interaction.fields.getTextInputValue('raidName');
			const raidLead = interaction.fields.getTextInputValue('raidLead');
			const raidDate = interaction.fields.getTextInputValue('date');
			const raidTier = interaction.fields.getTextInputValue('tier');
			const raidRoles = interaction.fields.getTextInputValue('roles');


			const verifyRaid = await verifyRaidExists(guildId, raidName);

			if (!verifyRaid) {
				await interaction.reply({ content: 'raid doesn\'t exists' });
				return;
			}

			const findUser = await interaction.client.users.cache.find((user: User) => user.username === raidLead);

			if (findUser) {
				const saveLead = await saveRaidLead(guildId, raidName, raidLead);

				if (!saveLead) {
					await interaction.reply({ content: `unable to save ${raidLead} as the raid leader`, ephemeral: true });
					return;
				}
			}
			else {
				await interaction.reply({ content: `${raidLead} user not found`, ephemeral: true });
				return;
			}

			const convertDate = convertToUTC(raidDate);
			const saveDate = saveRaidDate(guildId, raidName, convertDate);

			if (!saveDate) {
				await interaction.reply({ content: `unable to save date: ${raidDate}, make sure it is formatted correctly mm-dd hh:mm`, ephemeral: true });
				return;
			}

			const checkTierExists = await verifyTierExists(guildId, raidTier);

			if (checkTierExists) {
				const saveTier = await saveRaidTier(guildId, raidName, raidTier);

				if (!saveTier) {
					await interaction.reply({ content: `unable to save tier: ${raidDate}`, ephemeral: true });
					return;
				}
			}
			else {
				await interaction.reply({ content: `${raidTier} does not exist`, ephemeral: true });
				return;
			}

			const rolesSplit: string[] = raidRoles.split(' ');
			for (const r of rolesSplit) {
				if (isNaN(Number(r))) {
					interaction.reply({ content:'invalid roles, make sure you enter a number for each role.', ephemeral: true });
					return;
				}
			}

			const saveRoles = await saveRaidRoles(guildId, raidName, rolesSplit);

			if (!saveRoles) {
				await interaction.reply({ content:'unable to save roles', ephemeral: true });
				return;
			}

			await interaction.reply({ content: 'success', ephemeral: true });
		}
	},
};