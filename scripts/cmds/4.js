const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "4",
    version: "1.3",
    countDown: 5,
    role: 0,
    shortDescription: {
      vi: "Cắt ảnh thành 4 phần",
      en: "Crop image into 4 parts"
    },
    longDescription: {
      vi: "Trả lời một ảnh bằng lệnh này để cắt nó thành 4 phần bằng nhau",
      en: "Reply to an image with this command to crop it into 4 equal parts"
    },
    category: "image",
    guide: {
      en: "{pn}: Reply to an image to crop it into 4 parts"
    }
  },

  onStart: async function ({ message, event }) {
    if (event.type !== "message_reply" || !event.messageReply.attachments || event.messageReply.attachments.length === 0) {
      return message.reply("Please reply to an image with this command.");
    }

    const attachment = event.messageReply.attachments[0];
    if (attachment.type !== "photo") {
      return message.reply("The replied content must be an image.");
    }

    try {
      const imageUrl = attachment.url;
      const croppedImages = await cropImageIntoFourParts(imageUrl);
      
      await message.reply({
        body: "👁",
        attachment: croppedImages.map(file => fs.createReadStream(file))
      });

      croppedImages.forEach(file => fs.unlinkSync(file));
    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the image.");
    }
  }
};

async function cropImageIntoFourParts(imageUrl) {
  try {
    const image = await Jimp.read(imageUrl);
    const width = image.bitmap.width;
    const height = image.bitmap.height;

    const quadrants = [
      { x: 0, y: 0, w: width / 2, h: height / 2, name: 'quadrant_1' },
      { x: width / 2, y: 0, w: width / 2, h: height / 2, name: 'quadrant_2' },
      { x: 0, y: height / 2, w: width / 2, h: height / 2, name: 'quadrant_3' },
      { x: width / 2, y: height / 2, w: width / 2, h: height / 2, name: 'quadrant_4' }
    ];

    const croppedImages = await Promise.all(quadrants.map(async (quad) => {
      const outputPath = path.join(__dirname, `${quad.name}.png`);
      await image.clone()
        .crop(quad.x, quad.y, quad.w, quad.h)
        .writeAsync(outputPath);
      return outputPath;
    }));

    return croppedImages;
  } catch (error) {
    console.error("Error processing image:", error);
    throw error;
  }
}
