const { Client, GatewayIntentBits, Events } = require("discord.js");
const { token } = require("./config");
const messageHandler = require("./events/messageHandler");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, (c) => {
  console.log(`🤖 Bot Ready! Logged in as ${c.user.tag}`);
});

messageHandler(client);

client.login(token);