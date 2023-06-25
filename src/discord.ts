import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';

interface DiscordClient extends Client {
    commands: Collection<string, any>
}

// instantiates a new discord client
const client: DiscordClient = <DiscordClient> new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildPresences,
	GatewayIntentBits.GuildMembers,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.GuildMessageReactions,
	GatewayIntentBits.GuildModeration,
],
partials: [Partials.Message, Partials.Channel, Partials.Reaction] });

export { client };

