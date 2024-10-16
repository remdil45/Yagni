const PastebinAPI = require('pastebin-js');
const fs = require('fs');
const path = require('path');

module.exports = {
  config: {
    name: "adc",
    aliases: ["adcode"],
    version: "1.0",
    author: "SANDIP",
    countDown: 10,
    role: 0,
    shortDescription: {
      en: "Ubah cmd ke pastebin"
    },
    longDescription: {
      en: "This command allows you to upload files to pastebin and sends the link to the file."
    },
    category: "Hadi",
    guide: {
      en: "{pn} <file>.js"
    }
  },
  onStart: async function({ api, event, args }) {
const permission = ["100089550064027"];
    if (!permission.includes(event.senderID)) {
      return api.sendMessage("✨ 𝗣𝗮𝘀𝘁𝗲𝗯𝗶𝗻\n━━━━━━━━━━━\n you dont have permission this cmd. ", event.threadID, event.messageID);
    }

    const pastebin = new PastebinAPI({
      api_dev_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
      api_user_key: 'LFhKGk5aRuRBII5zKZbbEpQjZzboWDp9',
    });
    const fileName = args[0];
    const filePathWithoutExtension = path.join(__dirname, '..', 'cmds', fileName);
    const filePathWithExtension = path.join(__dirname, '..', 'cmds', fileName + '.js');
    if (!fs.existsSync(filePathWithoutExtension) && !fs.existsSync(filePathWithExtension)) {
      return api.sendMessage('✨ 𝗣𝗮𝘀𝘁𝗲𝗯𝗶𝗻\n━━━━━━━━━━━\n𝖥𝗂𝗅𝖾 𝗍𝗂𝖽𝖺𝗄 𝖺𝖽𝖺 𝖽𝗂𝗍𝖾𝗆𝗎𝗄𝖺𝗇', event.threadID);
    }
    const filePath = fs.existsSync(filePathWithoutExtension) ? filePathWithoutExtension : filePathWithExtension;
    fs.readFile(filePath, 'utf8', async (err, data) => {
      if (err) throw err;
      const paste = await pastebin
        .createPaste({
          text: data,
          title: fileName,
          format: null,
          privacy: 1,
        })
        .catch((error) => {
          console.error(error);
        });

      const rawPaste = paste.replace("pastebin.com", "pastebin.com/raw");

      api.sendMessage(`cmd install ${fileName}.js ${rawPaste}`, event.threadID, event.messageID);
    });
  },
};
