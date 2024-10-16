const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    config: {
        name: "randomanimal",
        aliases: ['adnimal', 'random-animal'],
        author: "Hassan",
        version: "1.0",
        shortDescription: "Get information about a random animal",
        longDescription: "Fetch detailed information about a random animal using the Some Random API.",
        category: "utility",
        guide: {
            vi: "Sá»­ dá»¥ng: !randomanimal\nVÃ­ dá»¥: !randomanimal",
            en: "Usage: !randomanimal\nExample: !randomanimal"
        }
    },

    onStart: async function ({ api, message, getLang }) {
        try {
            const animalTypes = ['dog', 'cat', 'panda', 'fox', 'bird', 'koala','horse','kangaroo' ];
            const randomAnimal = animalTypes[Math.floor(Math.random() * animalTypes.length)];
            const url = `https://some-random-api.com/animal/${randomAnimal}`;

            const response = await axios.get(url);

            if (response.data) {
                const { fact, image } = response.data;


                let animalInfo = `ðŸ“š Information about a random ${randomAnimal}:\n\n`;
                animalInfo += `**Fact**: ${fact}\n`;


                const imgResponse = await axios.get(image, { responseType: 'arraybuffer' });
                const imgPath = path.join(__dirname, 'cache', 'animal_image.jpg');
                await fs.outputFile(imgPath, imgResponse.data);
                const imgStream = fs.createReadStream(imgPath);


                await message.reply({
                    body: animalInfo,
                    attachment: imgStream
                });
            } else {
                await message.reply("Sorry, no information was found.");
            }
        } catch (error) {
            console.error(error);
            await message.reply("Sorry, there was an error fetching animal information.");
        }
    }
};
