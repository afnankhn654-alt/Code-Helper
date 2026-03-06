const { generateTextResponse, generateImageResponse } = require("../services/geminiService");
const { logMessage } = require("../utils/logger");

module.exports = (client) => {

client.on("messageCreate", async (message) => {

if (message.author.bot) return;

console.log(`Message: ${message.content}`);


// MAIN CHANNEL

if (message.channel.name === "🤖-code-helper") {

try {

const thread = await message.startThread({
name: `Help-${message.author.username}`,
autoArchiveDuration: 60
});

await logMessage(client, message);

await processAI(thread, message);

} catch (err) {

console.error("Thread Error:", err);

message.reply("⚠️ I need thread permissions!");

}

}


// THREAD MESSAGES

if (message.channel.isThread()) {

if (message.channel.parent?.name === "code-helper") {

await processAI(message.channel, message);

}

}

});

};



async function processAI(channel, message) {

try {

await channel.sendTyping();

if (message.attachments.size > 0) {

await generateImageResponse(channel, message);

}

else {

await generateTextResponse(channel, message);

}

}

catch(err){

console.error("AI Error:", err);

channel.send("⚠️ Sorry! There was a problem connecting to the AI side.");

}

}