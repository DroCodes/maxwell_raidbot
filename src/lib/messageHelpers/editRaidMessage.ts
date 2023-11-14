import { EmbedBuilder } from 'discord.js';

const editRosterMessage = async (tankList: string, healerList: string, dpsList: string, targetMessage: any) => {
	try {
		// const raid = await findRaid(guildId, raidName);
		// const roster = await getRoster(<number>raid?.id);
		//
		// const getRosterRoles = await getMainRoster(<number>roster?.id);
		//
		// const tankNames = getRosterRoles?.tanks || [];
		// const healerNames = getRosterRoles?.healers || [];
		// const dpsNames = getRosterRoles?.dps || [];
		//
		// const tankList = tankNames.join('\n');
		// const healerList = healerNames.join('\n');
		// const dpsList = dpsNames.join('\n');

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

		// const targetMessage = await reaction.message.channel.messages.fetch(raid.rosterMsgId);

		targetMessage.edit({ embeds: [rosterEmbed] });
	}
	catch (err) {
		console.error('could not edit message' + err);
	}
};

export { editRosterMessage };