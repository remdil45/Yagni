const axios = require("axios");
 
module.exports = {
  config: {
    name: "clonevoice",
    aliases: ["voiceclone","vc"],
    version: "1.0",
    author: "Arfan",
    role:0,
    category: "AI",
    guide: "Instantly clone your voice",
  },
 
  onStart: async function ({ event, message, args, api }) {
    try {
      const audioUrl = event.messageReply?.attachments[0]?.url;
      const prompt = args.join(" ");
      if (!audioUrl) {
        return message.reply('Please reply to an audio.');
      } else {
        const waitMessage = await message.reply("Please wait...");
 
        try {
          const response = await axios.get(
            `https://ts-ai-api-shuddho.onrender.com/api/clonevoice?speaker_url=${encodeURIComponent(audioUrl)}&text=${encodeURIComponent(prompt)}`
          );
 
          const respUrl = response.data.url;
          if (respUrl) {
            message.reply({
              body: `Here is your cloned voice:`,
              attachment: await global.utils.getStreamFromURL(respUrl)});
          } else {
            message.reply("Failed to clone voice!");
          }
        } catch (error) {
          console.error(error);
          message.reply("An error occurred while cloning voice.");
        }
 
        // Unsend the wait message
        api.unsendMessage(waitMessage.messageID);
      }
    } catch (error) {
      console.error(error);
      message.reply("An error occurred.");
    }
  },
};
