// import { SlashCommandBuilder } from 'discord.js';
// import { saveRaidLead } from '../../database/dataRepository/raidRepository';
// import { verifyBotChannel } from '../../services/verification/channelVerification';
// import { verifyRaidExists } from '../../services/verification/raidVerification';
//
// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('add_raid_lead')
// 		.setDescription('adds raid leader to the selected raid')
// 		.addStringOption(option =>
// 			option.setName('raid_name')
// 				.setDescription('the name of the raid')
// 				.setRequired(true))
// 		.addUserOption(option =>
// 			option.setName('raid_lead')
// 				.setDescription('the name of the raid leader')
// 				.setRequired(true)),
//
// 	isDevelopment: true,
//
// 	async execute(interaction: any) {
// 		const { guildId, options, channel } = interaction;
//
// 		try {
// 			const raidName = options.getString('raid_name');
// 			const raidLeader = options.getUser('raid_lead');
//
// 			const checkBotChannel = await verifyBotChannel(guildId, channel.id);
//
// 			if (!checkBotChannel) {
// 				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
// 				return;
// 			}
//
// 			const checkRaidExists = await verifyRaidExists(guildId, raidName);
//
// 			if (!checkRaidExists) {
// 				interaction.reply({ content: `Raid named ${raidName} does not exist`, ephemeral: true });
// 				return;
// 			}
//
// 			if (raidLeader === null) {
// 				interaction.reply({ content: 'please enter the raid leader', ephemeral: true });
// 			}
//
// 			const saveRaidLeader = await saveRaidLead(guildId, raidName, raidLeader.username);
//
// 			if (!saveRaidLeader) {
// 				interaction.reply({ content: 'there was an issue saving the raid leader', ephemeral: true });
// 			}
//
// 			interaction.reply({ content: `${raidLeader} successfully saved as ${raidName}'s raid leader`, ephemeral: true });
// 		}
// 		catch (err) {
// 			console.error('there was an issue running this command');
// 			interaction.reply({ content: 'there was an issue running this command', ephemeral: true });
// 		}
// 	},
// };