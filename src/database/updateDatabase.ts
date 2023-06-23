import guildSettings from "./models/guildSettings";
import raidSettings from "./models/raidSettings";
import raidEmoji from "./models/raidEmoji";

const updateDB = async () => {
    const dbArray = [guildSettings, raidSettings, raidEmoji]

    for (let i = 0; i < dbArray.length; i++) {
        console.log('iteration ' + i)
        await dbArray[i].sync({alter: true}).catch(e => console.log(`error syncing ${dbArray[i]}` + e))
        console.log(`${dbArray[i]} is done syncing`)
    }
    console.log('database was (re)created')
}

updateDB()
    .then(r => console.log('Database Updated'))
    .catch(e => {
        console.error('there was an error syncing the db', e)
    });