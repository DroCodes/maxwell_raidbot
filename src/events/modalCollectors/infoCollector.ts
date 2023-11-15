import {
	EmbedBuilder,
	Events,
} from 'discord.js';
import { verifyRaidExists } from '../../lib/verification/raidVerification';
import { findRaid, saveInfo } from '../../database/dataRepository/raidRepository';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { convertToUnixTime } from '../../lib/dateHelpers/dateFormater';

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

			const raid = await findRaid(guildId, raidName) as IRaidInstance;
			const user = await interaction.guild.members.cache.find((member:any) => member.user.username === raid.raidLead);

			if (raid.infoMsgId !== null) {
				const raidChannel = await interaction.guild.channels.fetch(raid.raidChannelId);
				const infoMessage = await raidChannel.messages.fetch(raid.infoMsgId);
				const convertDate = convertToUnixTime(<Date>raid.raidDateTime).toString();

				const embed = new EmbedBuilder()
					.setTitle('Raid Info')
					.addFields([
						{ name: 'Raid Lead', value: `<@${user.id}>` },
						{ name: 'Info', value: raidInfo },
						{ name: 'Local Raid Time:', value:`<t:${convertDate}>` },
					]);
				await infoMessage.edit({ embeds: [embed] });
				await interaction.reply({ content: `Raid info for ${raidName} updated as: \n\n${raidInfo}` });
				return;
			}

			await interaction.reply({ content: `Raid info for ${raidName} saved as: \n\n${raidInfo}` });
		}
	},
};