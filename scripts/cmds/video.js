const axios = require('axios');
const yts = require("yt-search");

const baseApiUrl = async () => {
    const base = await axios.get(
        `https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json`
    );
    return base.data.api;
};

(async () => {
    global.apis = {
        diptoApi: await baseApiUrl()
    };
})();

async function getStreamFromURL(url, pathName = "video.mp4") {
    try {
        const response = await axios.get(url, {
            responseType: "stream"
        });
        response.data.path = pathName;
        return response.data;
    } catch (err) {
        throw err;
    }
}

global.utils = {
    ...global.utils,
    getStreamFromURL: global.utils.getStreamFromURL || getStreamFromURL
};

const config = {
    name: "video",
    author: "Mesbah Saxx",
    credits: "Mesbah Saxx",
    version: "1.0.1",
    role: 0,
    hasPermssion: 0,
    description: "Fetches a YouTube video by title and returns it in video format.",
    usePrefix: true,
    prefix: true,
    category: "media",
    commandCategory: "media",
    cooldowns: 5,
    countDown: 5,
}

async function onStart({ api, args, event }) {
    try {
        const videoTitle = args.join(' ');
        const w = await api.sendMessage(`Searching video "${videoTitle}"...`, event.threadID);
        const r = await yts(videoTitle);
        const videos = r.videos.slice(0, 50);

        const videoData = videos[Math.floor(Math.random() * videos.length)];

        const { data: { title, quality, downloadLink } } = await axios.get(`${global.apis.diptoApi}/ytDl3?link=${videoData.videoId}&format=mp4`);

        api.unsendMessage(w.messageID);

        const shortenedLink = (await axios.get(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(downloadLink)}`)).data;

        await api.sendMessage({
            body: `🔖 - Title: ${title}
✨ - Quality: ${quality}

📥 - Download Link: ${shortenedLink}`,
            attachment: await global.utils.getStreamFromURL(downloadLink, "video.mp4")
        }, event.threadID, event.messageID);
    } catch (e) {
        api.sendMessage(e.message, event.threadID, event.messageID);
    }
}

module.exports = {
    config,
    onStart,
    run: onStart
};