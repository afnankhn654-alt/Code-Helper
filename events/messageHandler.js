const { generateTextResponse, generateImageResponse } = require("../services/geminiService");
const { logMessage } = require("../utils/logger");

module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    // 1. Ignore bots (including itself) to prevent infinite loops
    if (message.author.bot) return;

    console.log(`New Message from ${message.author.tag}: ${message.content}`);

    // 2. MAIN CHANNEL LOGIC (Creating a new thread)
    if (message.channel.name === "🤖-code-helper") {
      try {
        const thread = await message.startThread({
          name: `Help-${message.author.username}`,
          autoArchiveDuration: 60
        });

        await logMessage(client, message);
        await processAI(thread, message);
        
        // Stop execution here so the thread logic below doesn't run for the same message
        return; 
      } catch (err) {
        console.error("Thread Creation Error:", err);
        return message.reply("⚠️ I'm having trouble creating a thread. Please check my 'Create Public Threads' permissions!");
      }
    }

    // 3. THREAD MESSAGES LOGIC (Replying inside an existing thread)
    if (message.channel.isThread()) {
      // Check if the thread belongs to our helper channel
      // Using .includes() to be safe with emojis/exact naming
      if (message.channel.parent?.name.includes("code-helper")) {
        await processAI(message.channel, message);
        return;
      }
    }
  });
};

/**
 * Handles the AI logic and maintains the "Typing..." status
 */
async function processAI(channel, message) {
  // Start a heartbeat to keep "Bot is typing..." active (Discord clears it every ~10s)
  const typingInterval = setInterval(() => {
    channel.sendTyping().catch(err => console.error("Typing Error:", err));
  }, 5000);

  try {
    // Immediate first typing signal
    await channel.sendTyping();

    if (message.attachments.size > 0) {
      // If there's an image, use the multimodal vision response
      await generateImageResponse(channel, message);
    } else {
      // Otherwise, use standard text generation
      await generateTextResponse(channel, message);
    }
  } catch (err) {
    console.error("AI Processing Error:", err);
    await channel.send("⚠️ Sorry! There was a problem connecting to the AI. Please try again in a moment.");
  } finally {
    // ALWAYS clear the interval so the bot doesn't "type" forever
    clearInterval(typingInterval);
  }
}