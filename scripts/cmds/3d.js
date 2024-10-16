const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const apiKeys = ["gustichudi"]; // Add your API keys here

module.exports = {
    config: {
        name: "3d",
        author: "ST | Sheikh Tamim",
        countDown: 60,
        description: `Generate 3D art from an image by replying to an image message with this command\nModel Name:\n
1. Anime Remix Ai
2. Old School Anime Ai
3. Cybertoon Ai
4. Manga Remix Ai
5. Theft Ai
6. Studio Anime Ai
7. Marble Ai
8. PS2 Ai
9. Classic Cartoon Ai
10. 90s Anime Ai
11. New School Anime Ai
12. Extra Cute Ai
13. Comics Ai
14. Render Toon Ai
15. Elf Anime Ai
16. Toon Ai
17. Manga Ai
18. Vampire Ai
19. Oil Painting Ai
20. Tentacles Ai
21. Anime Ai
22. Neon Ai
23. Shine Ai
24. Space Ai
25. Clay Ai`,
        category: "Art Generator",
        guide: "3d <model_number>\nUse model numbers from 1 to 25",
        role: 0
    },

    onStart: async function ({ api, event, args }) {
        try {
            if (!event.messageReply) {
                await api.sendMessage("⚠️ | Please reply to an image to use this command.", event.threadID, event.messageID);
                return;
            }

            const repliedMessage = event.messageReply;
            if (!repliedMessage.attachments.length || repliedMessage.attachments[0].type !== 'photo') {
                await api.sendMessage("⚠️ | The replied message does not contain an image.", event.threadID, event.messageID);
                return;
            }

            const model = args[0]?.trim();
            if (!model || isNaN(model) || model < 1 || model > 25) {
                await api.sendMessage("⚠️ | Invalid model number. Please use a number between 1 and 25.", event.threadID, event.messageID);
                return;
            }

            const imageUrl = repliedMessage.attachments[0].url;
            let currentApiKeyIndex = 0;
            let responseReceived = false;

            while (!responseReceived && currentApiKeyIndex < apiKeys.length) {
                const apikey = apiKeys[currentApiKeyIndex];

                try {
                    const processingMessage = await api.sendMessage(`Processing your image with model ${model}. Please wait...`, event.threadID);

                    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

                    const formData = new FormData();
                    formData.append('image', Buffer.from(response.data, 'binary'), 'image.jpg');

                    const apiResponse = await axios.post(`https://loopsie-art.onrender.com/process-image?model=model${model}&apikey=${apikey}`, formData, {
                        headers: {
                            ...formData.getHeaders(),
                        },
                        responseType: 'json'
                    });

                    if (apiResponse.data.status && apiResponse.data.status.output && apiResponse.data.status.output.fileUrl) {
                        responseReceived = true;

                        const { delayTime, executionTime } = apiResponse.data.status;
                        const processingTime = (delayTime + executionTime) / 1000;

                        const imageUrl = apiResponse.data.status.output.fileUrl;
                        const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
                        const imageBuffer = Buffer.from(imageResponse.data, 'binary');
                        const imagePath = '/tmp/generated-image.jpg';
                        fs.writeFileSync(imagePath, imageBuffer);

                        try {
                            await api.unsendMessage(processingMessage.messageID);
                        } catch (deleteError) {
                            console.error('Error deleting initial message:', deleteError);
                        }

                        await api.sendMessage({
                            attachment: fs.createReadStream(imagePath),
                            body: `Here is your generated 3D art!\nModel: ${model}\nProcessing Time: ${processingTime.toFixed(2)} seconds`
                        }, event.threadID);

                        fs.unlinkSync(imagePath);
                    } else {
                        throw new Error('Image URL not found in API response');
                    }

                } catch (error) {
                    if (error.response && error.response.status === 403) {
                        if (error.response.data.error && error.response.data.error.includes('Api Key Has Expired')) {
                            await api.sendMessage("API Key has expired. Please update the API Key.", event.threadID, event.messageID);
                        } else {
                            await api.sendMessage(error.response.data.error, event.threadID, event.messageID);
                        }
                        currentApiKeyIndex++;
                    } else if (error.response && error.response.status === 502) {
                        await api.sendMessage("API is currently unavailable. Contact Owner", event.threadID, event.messageID);
                        break;
                    } else {
                        console.error('Error:', error);
                        await api.sendMessage("An error occurred while generating the image.", event.threadID, event.messageID);
                        break;
                    }
                }
            }

        } catch (error) {
            console.error('Error processing 3d command:', error);
            await api.sendMessage("⚠️ | Error processing 3d command. Please try again later.", event.threadID, event.messageID);
        }
    }
};
