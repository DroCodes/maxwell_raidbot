import { PermissionFlagsBits, REST, Routes, SlashCommandBuilder } from 'discord.js';
const fs = require('node:fs');
const path = require('node:path');
import 'dotenv/config';
import * as process from 'process';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('update_command')
		.setDescription('Updates list of commands in server')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

	isDevelopment: false,

	async execute(interaction: any) {
		const token = process.env.BOT_TOKEN as string;
		const clientId = process.env.CLIENT_ID as string;
		let msg : string;

		const commands = [];
		// Grab all the command files from the commands directory you created earlier
		const foldersPath = path.join(__dirname, '../');
		const commandFolders = fs.readdirSync(foldersPath);

		for (const folder of commandFolders) {
			// Grab all the command files from the commands directory you created earlier
			const commandsPath = path.join(foldersPath, folder);
			const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));
			// Grab the SlashCommandBuilder#toJSON() output of each command's dataRepository for deployment
			for (const file of commandFiles) {
				const filePath = path.join(commandsPath, file);
				const command = require(filePath);
				if ('data' in command && 'execute' in command && 'isDevelopment' in command) {
					if (interaction.guildId === process.env.GUILD_ID || !command.isDevelopment) {
						commands.push(command.data.toJSON());
					}
				}
				else {
					msg = `[WARNING] The ${command.data.name} command at ${filePath} is missing a required "data", "execute" or isDevelopment property.`;
					console.log(msg);
				}
			}
		}

		// Construct and prepare an instance of the REST module
		const rest = new REST().setToken(token);

		// and deploy your commands!
		await (async () => {
			try {
				// The put method is used to fully refresh all commands in the guild with the current set
				const data = await rest.put(
					Routes.applicationGuildCommands(clientId, interaction.guildId),
					{ body: commands },
				) as [];

				interaction.reply({ content: `Successfully reloaded ${data.length} application (/) commands.`, ephemeral: true });

			}
			catch (error) {
				// And of course, make sure you catch and log any errors!
				console.error(error);
			}
		})();
	},
};