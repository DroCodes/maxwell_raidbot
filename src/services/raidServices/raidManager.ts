import { PermissionsBitField } from 'discord.js';
import { IRaidInstance } from '../../interfaces/databaseInterfaces/IRaidAttributes';
import { IRaidSettingsInstance } from '../../interfaces/databaseInterfaces/IRaidSettingsAttributes';
import { findRaidSettings } from '../../database/dataRepository/raidSettingsRepository';

export default class RaidManager {
	static async openRaid(raid: IRaidInstance, settings: IRaidSettingsInstance, guild: any, roleId: string | null) {
		try {
			const raidSettings = await findRaidSettings(guild.id);
			const permissions = [];

			if (roleId !== null) {
				permissions.push({
					id: roleId,
					allow: [PermissionsBitField.Flags.ViewChannel],
					deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions],
				},
				{
					id: raidSettings?.raidLeadId,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
				},
				{
					id: guild.roles.everyone,
					deny: [PermissionsBitField.Flags.ViewChannel],
				});
			}
			else {
				permissions.push({
					id: guild.roles.everyone,
					deny: [PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.AddReactions],
				},
				{
					id: raidSettings?.raidLeadId,
					allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages],
				});
			}

			return await guild.channels.create({
				name: raid.raidName,
				parent: settings?.raidChannelGroup,
				permissionOverwrites: permissions,
			});
		}
		catch (error) {
			console.log(error);
		}
	}
}