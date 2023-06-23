import guildSettings from "./models/guildSettings";
import raidSettings from "./models/raidSettings";
import raidEmoji from "./models/raidEmoji";
import tier from "./models/tier";
import role from "./models/role";

const updateDB = async () => {
    const dbArray = [guildSettings, raidSettings, raidEmoji, tier, role]

    for (let i = 0; i < dbArray.length; i++) {
        console.log(i + '========================================================' + i)
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