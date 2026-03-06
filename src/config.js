require("dotenv").config();

module.exports = {
  token: process.env.TOKEN,
  geminiKey: process.env.GEMINI_KEY,
  logChannelId: process.env.LOG_CHANNEL_ID
};