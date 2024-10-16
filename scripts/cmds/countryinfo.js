const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "countryinfo",
    aliases: [],
    author: "Vex_Kshitiz",
    version: "1.0",
    cooldowns: 5,
    role: 0,
    shortDescription: "",
    longDescription: "Get information about a country.",
    category: "fun",
    guide: "{p}countryinfo {countryName}",
  },

  onStart: async function ({ api, event, args, message }) {
    async function checkAuthor(authorName) {
      try {
        const response = await axios.get('https://author-check.vercel.app/name');
        const apiAuthor = response.data.name;
        return apiAuthor === authorName;
      } catch (error) {
        console.error("Error checking author:", error);
        return false;
      }
    }

    const isAuthorValid = await checkAuthor(module.exports.config.author);
    if (!isAuthorValid) {
      await message.reply("Author changer alert! this cmd belongs to Vex_Kshitiz.");
      return;
    }

    const countryName = args.join(" ");
    const countryApiUrl = `https://country-info-eta.vercel.app/kshitiz?name=${encodeURIComponent(countryName)}`;

    try {
      const response = await axios.get(countryApiUrl);
      const {
        name,
        officialName,
        capital,
        region,
        subregion,
        population,
        area,
        languages,
        flag,
        coatOfArms,
        currency
      } = response.data;

      const infoText = `
        Name: ${name}
        Official Name: ${officialName}
        Capital: ${capital}
        Region: ${region}
        Subregion: ${subregion}
        Population: ${population}
        Area: ${area} km²
        Languages: ${languages}
        Currency: ${currency}
      `;

      const cacheDir = path.join(__dirname, 'cache');
      await fs.ensureDir(cacheDir);

      const images = [flag, coatOfArms];
      const imgData = [];

      for (let i = 0; i < images.length; i++) {
        try {
          const imgResponse = await axios.get(images[i], { responseType: 'arraybuffer' });
          const extension = path.extname(images[i]) || '.jpg';
          const imgPath = path.join(cacheDir, `${i + 1}.jpg`);
          await fs.outputFile(imgPath, imgResponse.data);
          imgData.push(fs.createReadStream(imgPath));
        } catch (error) {
          console.error(error);
        }
      }

      await api.sendMessage({
        attachment: imgData,
        body: infoText.trim(),
      }, event.threadID, event.messageID);

      imgData.forEach((stream, index) => {
        const extension = path.extname(images[index]) || '.jpg';
        fs.unlink(path.join(cacheDir, `${index + 1}${extension}`), (err) => {
          if (err) console.error(`Error deleting temp file: ${err}`);
        });
      });

    } catch (error) {
      console.error(error);
      message.reply("Sorry, an error occurred while processing your request.");
    }
  }
};
