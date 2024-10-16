const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "gimg",
    author: "Samir Œ",
    version: "1.0",
    shortDescription: "Get images from a given search query",
    longDescription: "Get images from a Google search ",
    category: "Image"
  },

  onStart: async function ({ api, event, args }) {
    let searchQuery = args.join(' ');

    if (searchQuery) {
      try {
        const response = await axios.get(`https://samirxpikachuiox.onrender.com/google/imagesearch?q=${encodeURIComponent(searchQuery)}`);
        const data = response.data.data;
        const imgData = [];

        for (let i = 0; i < Math.min(6, data.length); i++) {
          const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.promises.writeFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
          attachment: imgData,
          body: `Here are some images for "${searchQuery}"`
        }, event.threadID, event.messageID);

      } catch (error) {
        console.error("Failed to fetch or send images:", error.message);
        api.sendMessage({ body: "Failed to get random images." }, event.threadID);
      }
    } else {
      let links = [];

      for (let attachment of event.messageReply.attachments) {
        links.push(attachment.url);
      }

      try {
        const shortLink1 = await global.utils.uploadImgbb(links[0]);
        const imageUrl = shortLink1.image.url;
        const response = await axios.get(`https://samirxpikachuiox.onrender.com/find?imageUrl=${imageUrl}`);
        const data = response.data.data;
        const imgData = [];

        for (let i = 0; i < Math.min(6, data.length); i++) {
          const imgResponse = await axios.get(data[i], { responseType: 'arraybuffer' });
          const imgPath = path.join(__dirname, 'cache', `${i + 1}.jpg`);
          await fs.promises.writeFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        }

        await api.sendMessage({
          attachment: imgData,
          body: `Here are some similar images`
        }, event.threadID, event.messageID);

      } catch (error) {
        console.error("Failed to fetch or send images:", error.message);
        api.sendMessage({ body: "Failed to get random images." }, event.threadID);
      }
    }
  }
};
