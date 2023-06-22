import guildSettings from "./models/guildSettings";
import raidSettings from "./models/raidSettings";

const updateDB = async () => {
    await guildSettings.sync({alter: true});
    await raidSettings.sync({alter: true})
    console.log('database was (re)created')
}

updateDB()
    .then(r => console.log('Database Updated'))
    .catch(e => {
        console.error('there was an error syncing the db', e)
    });