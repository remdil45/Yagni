const rubishapi = global.GoatBot.config.rubishapi;

module.exports = {
    config: {
      name: "faceswap",
      aliases: ["swap"],
      author: "RUBISH",
      version: "2.0",
      cooldowns: 5,
      role: 0,
      shortDescription: {
        en: "Swap faces in images"
      },
      longDescription: {
        en: "This command enables you to swap faces in images, creating amusing combinations."
      },
      category: "Image",
      guide: {
        en: "{pn} <reply with 2 images>"
      }
    },


  onStart: async function({ message, event, api }) {
    try {

      const setReactionInProgress = () => {
        api.setMessageReaction("⏳", event.messageID, (err) => {
          if (err) console.error(err);
        }, true);
      };


      const setReactionSuccess = () => {
        api.setMessageReaction("✅", event.messageID, (err) => {
          if (err) console.error(err);
        }, true);
      };

      if (event.type != "message_reply") {
        return message.reply("⚠️ | Please reply to a message with two images attached.");
      }

      let links = [];
      for (let attachment of event.messageReply.attachments) {
        links.push(attachment.url);
      }

      if (links.length < 2) {

        setReactionSuccess(); 
        return message.reply("⚠️ | Please ensure there are exactly two images attached.");
      }

      setReactionInProgress();

      const maskimg = await global.utils.uploadImgbb(links[0]);
      const maskimgurl = maskimg.image.url;

      const targetimg = await global.utils.uploadImgbb(links[1]);
      const targetimgurl = targetimg.image.url;

      let swapface = `${rubishapi}/faceswap?target=${targetimgurl}&mask=${maskimgurl}&apikey=rubish69`;
      const transformingMessage = await message.reply({ body: "⏳ | Face swapping, Please wait" });

      const transformedImageStream = await global.utils.getStreamFromURL(swapface);

      await api.unsendMessage(transformingMessage.messageID);

      await message.reply({ body: "✅ | Successfully swapped face", attachment: transformedImageStream });

      setReactionSuccess(); 

    } catch (error) {
      console.error(error);
      message.reply("An error occurred while processing the face swap.");
    }
  }
};
