module.exports = {
  config: {
    name: "lyrics2",
    version: "1.0",
    author: "Samir Œ",
    shortDescription: "Get lyrics of a song",
    longDescription: "Get lyrics of a song based on the query.",
    category: "𝗠𝗘𝗗𝗜𝗔",
    guide: "{prefix}lyrics <song>",
  },

  onStart: async function ({ api, event, args }) {
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("Please provide the name of the song.", event.threadID);
    }

    try {
      const response = await axios.get(`https://samirxpikachuiox.onrender.com/lyrics?query=${encodeURIComponent(query)}`);
      const { title, artist, lyrics, image } = response.data;

      let messageBody = `Title: ${title}\n\nArtist: ${artist}\n\n${lyrics}`;


      await api.sendMessage({
        body: messageBody,
        attachment: await global.utils.getStreamFromURL(image)
      }, event.threadID);

    } catch (error) {
      console.error(error);
      return api.sendMessage("Failed to fetch lyrics.", event.threadID);
    }
  }
};
