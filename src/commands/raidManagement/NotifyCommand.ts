import { SlashCommandBuilder } from 'discord.js';
import { findRaid } from '../../database/dataRepository/raidRepository';
import { getRoster } from '../../database/dataRepository/rosterRepository';
import { getMainRoster } from '../../database/dataRepository/mainRosterRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('notify')
		.setDescription('nNotify members of changes to the raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('message')
				.setDescription('the message to send to the raid members')
				.setRequired(true)),

	isDevelopment: false,

	async execute(interaction: any) {
		const { guild, guildId, options } = interaction;
		const raidName = options.getString('raid_name');
		const message = options.getString('message');

		const raid = await findRaid(guildId, raidName);

		if (raid === null || raid === undefined) {
			interaction.reply({ content: `Raid ${raidName} does not exist`, ephemeral: true });
			return;
		}

		const roster = await getRoster(<number>raid.id);

		if (roster === null || roster === undefined) {
			interaction.reply({ content: `Raid ${raidName} does not have a roster`, ephemeral: true });
			return;
		}

		const mainRoster = await getMainRoster(<number>roster?.id);

		if (mainRoster === null || mainRoster === undefined) {
			interaction.reply({ content: `Raid ${raidName} does not have a main roster`, ephemeral: true });
			return;
		}

		const members : string[] = [];

		mainRoster.tanks?.forEach(t => {
			members.push(t);
		});

		mainRoster.healers?.forEach(h => {
			members.push(h);
		});

		mainRoster.dps?.forEach(d => {
			members.push(d);
		});

		for (const key in members) {
			const member = members[key];
			try {
				const discordMemeber = await interaction.guild.members.fetch();

				for (const m of discordMemeber) {
					if (m[1].user.username === member) {
						await m[1].send(`new message from the  raid raid leader of ${raidName}: ${message}`);
					}
				}

				interaction.reply({ content: `Message sent to members of raid ${raidName}`, ephemeral: true });
			}
			catch (err: any) {
				console.log(`There was an issue sending a message to ${member}`, err.message);
				interaction.reply({ content: `There was an issue sending a message to ${member}`, ephemeral: true });
			}
		}
	},
};