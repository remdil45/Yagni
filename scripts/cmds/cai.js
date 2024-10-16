const axios = require("axios");
 
let defaultCharacter = "";
 
module.exports = {
  config: {
    name: "cai",
    version: "1.0",
    author: "Samir Œ",
    aliases: ["roleplay", "pretend"],
    countDown: 5,
    role: 0,
    category: "𝗙𝗨𝗡"
  },
  onStart: async function ({ message, event, args, commandName }) {
    const [question, character] = args.join(' ').split('|').map(item => item.trim());
    const selectedCharacter = character || defaultCharacter;
let uid = event.senderID;
    try {
      const response = await axios.get(`https://samirxpikachuiox.onrender.com/characterAi?message=${encodeURIComponent(question)}&name=${encodeURIComponent(selectedCharacter)}&userID=${uid}`);
 
      if (response.data && response.data) {
        const answer = response.data.text;
        const characterName = `${answer}`;
 
        const ansimg = response.data.profile;
        message.reply({ body: characterName, attachment:await global.utils.getStreamFromURL(`${ansimg}`) }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            character: selectedCharacter
          });
        });
      }
 
    } catch (error) {
      message.reply("Error:", error.message);
    }
  },
 
  onReply: async function ({ message, event, Reply, args }) {
    let { author, commandName, character } = Reply;
    if (event.senderID != author) return;
    const [question] = args.join(' ').split('|').map(item => item.trim());
let uid = event.senderID;
    try {
      const response = await axios.get(`https://samirxpikachuiox.onrender.com/characterAi?message=${encodeURIComponent(question)}&name=${encodeURIComponent(character)}&userID=${uid}`);
 
      if (response.data && response.data) {
        const answer = response.data.text;
        const characterName = `${answer}`;
        message.reply({ body: characterName }, (err, info) => {
          global.GoatBot.onReply.set(info.messageID, {
            commandName,
            messageID: info.messageID,
            author: event.senderID,
            character: character
          });
        });
      }
 
    } catch (error) {
      message.reply("Error:", error.message);
    }
  }
};
