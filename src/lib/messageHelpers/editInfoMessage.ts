import { EmbedBuilder } from 'discord.js';

export const editInfoMessage = (content: any) => {

	if (content.raidMessage === null) {
		content.raidMessage = 'No raid info set';
	}

	if (content.raidTime === null) {
		content.raidTime = 'No raid time set';
	}

	if (content.raidLeader === null) {
		content.raidLeader = 'No raid leader set';
	}

	return new EmbedBuilder()
		.setTitle('Raid Info')
		.addFields([
			{ name: 'Raid Lead', value: content.raidLeader },
			{ name: 'Info', value: content.raidMessage },
			{ name: 'Local Raid Time:', value: content.raidTime },
		]);
};