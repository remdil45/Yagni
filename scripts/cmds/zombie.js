const valentine = {
  name: "zombie",
  version: "1.0",
  author: "Samir Œ",
  countDown: 5,
  role: 0,
  description: {
    en: "𝗜𝗺𝗮𝗴𝗲 𝘁𝗼 𝘇𝗼𝗺𝗯𝗶𝗲"
  },
  category: "𝗔𝗜",
  guide: {
    en: "{pn} reply to image"
  }
};


const samirxrichi = async ({ api, event }) => {
  const imageLink = event.messageReply?.attachments[0]?.url;
  if (!imageLink) {
    return api.sendMessage('𝙿𝚕𝚎𝚊𝚜𝚎 𝚛𝚎𝚙𝚕𝚢 𝚝𝚘 𝚊𝚗 𝚒𝚖𝚊𝚐𝚎.', event.threadID, event.messageID);
  }

  try {
    const apiUrl = `${global.GoatBot.config.API.SAMIR}/zombie?imgurl=${encodeURIComponent(imageLink)}`;
    const imageStream = await global.utils.getStreamFromURL(apiUrl);
    if (!imageStream) {
      return api.sendMessage('𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚊𝚗𝚒𝚖𝚊𝚝𝚎 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎.', event.threadID, event.messageID);
    }
    return api.sendMessage({ attachment: imageStream }, event.threadID, event.messageID);
  } catch (error) {
    console.log(error);
    return api.sendMessage('𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚊𝚗𝚒𝚖𝚊𝚝𝚎 𝚝𝚑𝚎 𝚒𝚖𝚊𝚐𝚎.', event.threadID, event.messageID);
  }
};

module.exports = {
  config: valentine ,
  onStart: samirxrichi,
};