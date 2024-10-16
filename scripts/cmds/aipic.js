const axios = require("axios");
const path = require("path");
const fs = require("fs");

module.exports.config = {
  name: "aipic",
  version: "1.0.0",
  Description: "AI Text to image generator",
  authon: "Kingi Charles",
  guide: "[prompt]",
  role: 0,
  countdown: 10,
  category: "Edit", 
};

module.exports.onStart = async function ({ api, event, args }) {
  try {
    const link = args.join(" ");
    if (!link) {
      return api.sendMessage(`${global.config.PREFIX}aipic [prompt]`, event.threadID, event.messageID);
    }

    const response = await axios.get(`https://sms-bomb.vercel.app/api/aipic.php?prompt=${link}`, { responseType: "arraybuffer" });
    const img = response.data;

    const imgPath = path.join(__dirname, "cache", "oggypic.png");

    fs.writeFileSync(imgPath, Buffer.from(img, "utf-8"));

    await api.sendMessage({body: `✅ | 𝙸𝚖𝚊𝚐𝚎 𝙶𝚎𝚗𝚎𝚛𝚊𝚝𝚎𝚍`, attachment: fs.createReadStream(imgPath), }, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`❌ | Something went wrong. please try again.`, event.threadID, event.messageID);
    console.error(error);
  }
};
