import guildSettings from './models/guildSettings';
import raidSettings from './models/raidSettings';
import raidEmoji from './models/raidEmoji';
import tier from './models/tier';
import raid from './models/raid';
import roster from './models/roster';
import mainRoster from './models/mainRoster';
import overflowRoster from './models/overflowRoster';

const updateDB = async () => {
	const dbArray = [guildSettings, raidSettings, raidEmoji, tier, raid, roster, mainRoster, overflowRoster];

	for (let i = 0; i < dbArray.length; i++) {
		console.log(i + '========================================================' + i);
		await dbArray[i].sync({ alter: true }).catch(e => console.log(`error syncing ${dbArray[i]}` + e));
		console.log(`${dbArray[i]} is done syncing`);
	}
	console.log('database was (re)created');
};

try {
	updateDB();
}
catch (err) {
	console.error('there was an error syncing the db', err);
}