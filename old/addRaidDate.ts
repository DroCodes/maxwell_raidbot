// import { SlashCommandBuilder } from 'discord.js';
// // import { verifyBotChannel } from '../../services/verification/channelVerification';
// // import { verifyRaidExists } from '../../services/verification/raidVerification';
// // import { saveRaidDate, saveRaidLead } from '../../database/dataRepository/raidRepository';
// // import { parseDate } from '../../services/dateHelpers/dateFormater';
//
// module.exports = {
// 	data: new SlashCommandBuilder()
// 		.setName('add_date')
// 		.setDescription('adds the date of the raid')
// 		.addStringOption(option =>
// 			option.setName('raid_name')
// 				.setDescription('the name of the raid')
// 				.setRequired(true))
// 		.addStringOption(option =>
// 			option.setName('raid_date')
// 				.setDescription('the date of the raid mm-dd hh:mm')
// 				.setRequired(true)),
//
// 	isDevelopment: true,
//
// 	async execute(interaction: any) {
// 		const { guildId, options, channel } = interaction;
//
// 		try {
// 			const raidName = options.getString('raid_name');
// 			const raidDate = options.getString('raid_date');
//
// 			const checkBotChannel = await verifyBotChannel(guildId, channel.id);
//
// 			if (!checkBotChannel) {
// 				interaction.reply({ content: 'this is not the bot channel', ephemeral: true });
// 				return;
// 			}
//
// 			console.log('test 1');
//
// 			const checkRaidExists = await verifyRaidExists(guildId, raidName);
//
// 			if (!checkRaidExists) {
// 				interaction.reply({ content: `Raid named ${raidName} does not exist`, ephemeral: true });
// 				return;
// 			}
//
// 			const convertTime = parseDate(raidDate);
//
// 			const addDate = await saveRaidDate(guildId, raidName, convertTime);
//
// 			if (!addDate) {
// 				interaction.reply({ content: 'unsuccessfully saved the date', ephemeral: true });
// 				return;
// 			}
//
// 			interaction.reply({ content: `the date for ${raidName} has been saved as ${raidDate}`, ephemeral: true });
// 		}
// 		catch (err) {
// 			console.error('there was an issue running this command');
// 			interaction.reply({ content: 'there was an issue running this command', ephemeral: true });
// 		}
// 	},
// };