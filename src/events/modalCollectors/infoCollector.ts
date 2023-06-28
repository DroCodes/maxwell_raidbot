import {
	Events,
} from 'discord.js';
import { verifyRaidExists } from '../../lib/verification/raidVerification';
import { saveInfo } from '../../database/dataRepository/raidRepository';

module.exports = {
	name: Events.InteractionCreate,

	async execute(interaction: any) {
		if (!interaction.isModalSubmit()) return;
		if (interaction.customId === 'info') {
			const { guildId } = interaction;
			const raidName = interaction.fields.getTextInputValue('raidName');
			const raidInfo = interaction.fields.getTextInputValue('raidInfo');

			const verifyRaid = await verifyRaidExists(guildId, raidName);

			if (!verifyRaid) {
				await interaction.reply({ content: 'raid doesn\'t exists' });
				return;
			}

			const saveRaidInfo = await saveInfo(guildId, raidName, raidInfo);

			if (!saveRaidInfo) {
				interaction.reply('there was an issue saving the raid info');
				return;
			}

			await interaction.reply({ content: `Raid info for ${raidName} saved as: \n\n${raidInfo}` });
		}
	},
};