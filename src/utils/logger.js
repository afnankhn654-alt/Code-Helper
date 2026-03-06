const { logChannelId } = require("../config");

async function logMessage(client,message){

try{

const channel = await client.channels.fetch(logChannelId).catch(()=>null);

if(!channel) return;

await channel.send(

`User: ${message.author.tag}
Channel: ${message.channel.name}
Message: ${message.content}`

);

}

catch(err){

console.error("Logger Error:",err);

}

}

module.exports={logMessage};