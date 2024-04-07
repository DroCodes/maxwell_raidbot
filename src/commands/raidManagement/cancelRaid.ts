import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { deleteRaid, findRaid } from '../../database/dataRepository/raidRepository';
import { getRoster } from '../../database/dataRepository/rosterRepository';
import { deleteMainRoster, getMainRoster } from '../../database/dataRepository/mainRosterRepository';
import { deleteOverflow } from '../../database/dataRepository/overflowRosterRepository';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('cancel_raid')
		.setDescription('cancel the raid')
		.addStringOption(option =>
			option.setName('raid_name')
				.setDescription('the name of the raid')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('reason')
				.setDescription('the reason for the cancellation'))
		.setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),


	isDevelopment: false,

	async execute(interaction: any) {
		try {
			const { guild, guildId, options } = interaction;
			const raidName = options.getString('raid_name');
			let reason = options.getString('reason');

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

			// const members = mainRoster.tanks?.concat(mainRoster.healers, mainRoster.dps);

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

			if (reason === null) {
				console.log('raid was canceled without a reason');
				reason = 'no reason provided';
			}

			for (const key in members) {
				const member = members[key];
				try {
					const discordMemeber = await interaction.guild.members.fetch();

					for (const m of discordMemeber) {
						if (m[1].user.username === member) {
							await m[1].send(`Raid ${raidName} has been canceled, reason: ${reason}`);
						}
					}
				}
				catch (err: any) {
					console.log(`There was an issue sending a message to ${member}`, err.message);
				}
			}

			await deleteMainRoster(<number>roster?.id);
			await deleteOverflow(<number>roster?.id);
			await deleteRaid(guildId, raidName);

			await guild.channels.delete(raid.raidChannelId);


			interaction.reply({ content: `Raid ${raidName} was canceled, members were notified`, ephemeral: true });
		}
		catch (err) {
			console.error('there was an issue running this command', err);
			interaction.reply({ content: 'there was an issue running this command, contact support for assistance', ephemeral: true });
		}
	},
};