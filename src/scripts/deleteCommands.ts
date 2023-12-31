import * as process from 'process';

import { REST, Routes } from 'discord.js';
// const { clientId, guildId} = require('../config.json');
// const fs = require('node:fs');
import fs from 'node:fs';
// const path = require('node:path');
import path from 'node:path';
import 'dotenv/config';

const token = process.env.BOT_TOKEN as string;
const clientId = process.env.CLIENT_ID as string;
const guildId = process.env.GUILD_ID as string;

// const commands = [];
// Grab all the command files from the commands directory you created earlier
// const foldersPath = path.join(__dirname, 'commands');
// const commandFolders = fs.readdirSync(foldersPath);
//
// for (const folder of commandFolders) {
// 	// Grab all the command files from the commands directory you created earlier
// 	const commandsPath = path.join(foldersPath, folder);
// 	const commandFiles = fs.readdirSync(commandsPath).filter((file: any) => file.endsWith('.ts'));
// 	// Grab the SlashCommandBuilder#toJSON() output of each command's dataRepository for deployment
// 	for (const file of commandFiles) {
// 		const filePath = path.join(commandsPath, file);
// 		// eslint-disable-next-line @typescript-eslint/no-var-requires
// 		const command = require(filePath);
// 		if ('data' in command && 'execute' in command) {
// 			commands.push(command.data.toJSON());
// 		}
// 		else {
// 			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
// 		}
// 	}
// }

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
	try {
		rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] })
			.then(() => console.log('Successfully deleted all guild commands.'))
			.catch(console.error);

		// for global commands
		rest.put(Routes.applicationCommands(clientId), { body: [] })
			.then(() => console.log('Successfully deleted all application commands.'))
			.catch(console.error);
	}
	catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();