import { PermissionsBitField } from 'discord.js';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { IRaidSettingsInstance } from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes';

export default class RaidManager {
	static async openRaid(raid: IRaidInstance, settings: IRaidSettingsInstance, guild: any, roleId: string | null) {
		try {
			const permissions = [];

			if (roleId !== null) {
				permissions.push({
					id: roleId,
					allow: [PermissionsBitField.Flags.ViewChannel],
					deny: [PermissionsBitField.Flags.SendMessages],
				},
				{
					id: guild.roles.everyone,
					deny: [PermissionsBitField.Flags.ViewChannel],
				});
			}
			else {
				permissions.push({
					id: guild.roles.everyone,
					deny: [PermissionsBitField.Flags.SendMessages],
				});
			}
			console.log(permissions);
			const channelCreate = await guild.channels.create({
				name: raid.raidName,
				parent: settings?.raidChannelGroup,
				permissionOverwrites: permissions,
			});

			return channelCreate;
		}
		catch (error) {
			console.log(error);
		}
	}
}