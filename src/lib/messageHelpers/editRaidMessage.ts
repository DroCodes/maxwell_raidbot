import { EmbedBuilder } from 'discord.js';

const editRosterMessage = async (tankList: string, healerList: string, dpsList: string, targetMessage: any) => {
	try {
		const rosterEmbed = new EmbedBuilder()
			.setTitle('Roster')
			.addFields(
				{ name: '__Counts By Roles:__', value: ' ' },
			)
			.addFields(
				{ name: 'Tanks', value: tankList + ' ' },
			)
			.addFields(
				{ name: 'Healers:', value: healerList + ' ' },
			)
			.addFields(
				{ name: 'DPS', value: dpsList + ' ' },
			);

		targetMessage.edit({ embeds: [rosterEmbed] });
	}
	catch (err) {
		console.error('could not edit message' + err);
	}
};

export { editRosterMessage };