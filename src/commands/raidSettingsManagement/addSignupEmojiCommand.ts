import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { findGuildById } from '../../database/dataRepository/guildSettingsRepository';
import { saveRaidEmoji } from '../../database/dataRepository/raidSettingsRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('add_signup_emoji')
		.setDescription('add signup emoji')
		.addStringOption((option: any) =>
			option.setName('role')
				.setDescription('role to assign to emoji')
				.setRequired(true))
		.addStringOption((option: any) =>
			option.setName('emoji')
				.setDescription('emoji to add to role')
				.setRequired(true))
		.addStringOption((option: any) =>
			option.setName('raid_role')
				.setDescription('Role the emoji represents')
				.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guildId, options, channel } = interaction;
			const guild = await findGuildById(guildId);

			if (channel.id != guild?.botChannelId) {
				interaction.reply('This is not the bot channel.');
				return;
			}

			const role = options.getString('role');
			const emoji = options.getString('emoji');
			const raidRole = options.getString('raid_role');

			const addSignUpEmoji = await saveRaidEmoji(guildId, role, emoji, raidRole);

			if (addSignUpEmoji === null) {
				interaction.reply({ content: 'there was an issue saving the role and emoji', ephemeral: true });
			}

			interaction.reply({ content: `Role saved as ${role}, Emoji saved as ${emoji}`, ephemeral: true });
		}
		catch (err) {
			console.error(`there was an issue executing ${this.data.name}`, err);
			interaction.reply({ content: `there was an issue executing ${this.data.name}`, ephemeral: true });
		}
	},
};