import { client } from './discord';
import { Collection, Events } from 'discord.js';
import 'dotenv/config';
import fs from 'node:fs';
import path from 'node:path';

const token = process.env.BOT_TOKEN as string;

client.commands = new Collection();

// loops through the events folder to listen for the events
const eventFoldersPath = path.join(__dirname, 'events');
const eventsFolder = fs.readdirSync(eventFoldersPath);

for (const folder of eventsFolder) {
	const eventsPath = path.join(eventFoldersPath, folder);
	const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts'));

	for (const file of eventFiles) {
		const filePath = path.join(eventsPath, file);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const event = require(filePath);
		if (event.once) {
			client.once(event.name, (...args) => event.execute(...args));
		}
		else {
			client.on(event.name, (...args) => event.execute(...args));
		}
	}
}

const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		// eslint-disable-next-line @typescript-eslint/no-var-requires
		const command = require(filePath);
		// Set a new item in the Collection with the key as the command name and the value as the exported module
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		}
		else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

client.login(token);
