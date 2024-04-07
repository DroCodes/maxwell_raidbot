import { EmbedBuilder } from 'discord.js';

const editRosterMessage = (mainRoster: string, overflowRoster: string, roleCount: number[], rosterCount: string, message: string) => {
	try {
		return new EmbedBuilder()
			.setTitle('__Roster__:')
			.setDescription(mainRoster)
			.addFields(
				{ name: '__Overflow:__', value: overflowRoster },
				{ name: '__Counts By Roles:__', value: `Tanks: ${roleCount[0]}\nHealers: ${roleCount[1]}\nDPS: ${roleCount[2]}` },
				{ name: '__Total Main Roster Count:__', value: rosterCount },
			);
	}
	catch (err) {
		console.error('Issue creating message' + err);
	}
};

export { editRosterMessage };