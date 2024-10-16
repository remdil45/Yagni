const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
  config: {
    name: "loreen",
    aliases: ["loreenImgs"],
    version: "1.0",
    author: "Hassan",
    countDown: 15,
    role: 0,
    shortDescription: "Send random images",
    longDescription: "Send random images from a predefined set",
    category: "download",
    guide: {
      en: "{pn}"
    }
  },

  onStart: async function ({ api, message, args }) {
    try {
      const waitingMessage = await message.reply("Please wait...");

      const response = await axios.get('https://image-4a00.onrender.com/random');

      if (response.status === 200) {
        const urls = response.data.urls;
        const imagePaths = [];
        const attachments = [];


        for (let i = 0; i < urls.length; i++) {
          const imgResponse = await axios.get(urls[i], { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `random_image_${i}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imagePaths.push(imgPath);
          attachments.push(fs.createReadStream(imgPath));
        }

        await api.unsendMessage(waitingMessage.messageID);

        await message.reply({
          body: "âœ… | Here are random images",
          attachment: attachments
        });

        
        for (const imgPath of imagePaths) {
          await fs.remove(imgPath);
        }
      } else {
        throw new Error("Failed to fetch image URLs");
      }
    } catch (error) {
      await message.reply("Failed to send random images! Try again later.");
    }
  }
}
