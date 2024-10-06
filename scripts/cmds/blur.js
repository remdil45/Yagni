const axios = require('axios');
const TinyURL = require('tinyurl');
const fs = require('fs');
const path = require('path');
 
module.exports = {
  config: {  name: "blur",
    version: "1.0",
    author: "Samir Œ",
    countDown: 5,
    role: 2,
    description: {
      vi: "Tạo ảnh ảo giác từ ảnh gốc",
      en: "Create an illusion image from the original image"
    },
    category: "image",
    guide: {
      vi: "{pn} [prompt] - Trả lời một hình ảnh với lệnh này",
      en: "{pn} [prompt] - Reply to an image with this command"
    }
  },
 
  onStart: async function ({ api, args, message, event }) {
    const { messageReply } = event;
    if (!messageReply || !messageReply.attachments || messageReply.attachments.length === 0) {
      return message.reply("Please reply to an image with this command.");
    }
 
    const imageUrl = messageReply.attachments[0].url;
    const prompt = args.join(" ") || "34";
 
    try {
      const shortenedUrl = await TinyURL.shorten(imageUrl);
      const { data } = await axios.get(`https://samirxpikachuiox.onrender.com/api/shorten?url=${encodeURIComponent(shortenedUrl)}`);
      const shortLink = data.short;
 
      const illusionUrl = `https://samirxpikachuiox.onrender.com/bgblur?url=${encodeURIComponent(shortLink)}&strength=${encodeURIComponent(prompt)}`;
      const imageResponse = await axios.get(illusionUrl, { responseType: 'arraybuffer' });
      const imagePath = path.join(__dirname, 'blurredImage.png');
 
      fs.writeFileSync(imagePath, imageResponse.data);
 
      await message.reply({
        attachment: fs.createReadStream(imagePath),
      });
    } catch (error) {
      message.reply(`An error occurred: ${error.message}`);
    }
  }
};