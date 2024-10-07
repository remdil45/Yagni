const v = require('axios');
const { GoatWrapper } = require('fca-liane-utils');

module.exports = {
	config: {
		name: "fluxpro",
		aliases: ["fp"],
		version: "1.0",
		author: "deku",
		countDown: 5,
		role: 0,
		longDescription: "Generate image from fal ai flux pro",
		category: "image",
		guide: {
			en: "{p}{n} <prompt> | <model_number>"
		}
	},

	onStart: async function ({ api: yazky, event: e, args: a }) {
		try {
			const { messageID, threadID } = e;
			const pr = a.join(' ');

			const [p, m] = pr.split(" | ");

			if (!p || !m) {            
				const o = await new Promise(resolve => {
					yazky.sendMessage('Please provide a prompt first', threadID, (err, info) => {
						resolve(info);
					});
				});
				setTimeout(() => {
					yazky.unsendMessage(o.messageID);
				}, 7000);
				return;
			}

			const cliff = await new Promise(resolve => { 
				yazky.sendMessage(`֎ 𝖦𝖾𝗇𝖾𝗋𝖺𝗍𝗂𝗇𝗀 𝗂𝗆𝖺𝗀𝖾 please wait...`, threadID, (err, info1) => {
					resolve(info1);
				}, messageID);
			});

			const k = `https://deku-rest-api.gleeze.com/api/flux?prompt=${encodeURIComponent(p)}&model=${m}`;

			const j = await v.get(k, { responseType: 'stream' });

			yazky.unsendMessage(cliff.messageID);

			yazky.sendMessage({ attachment: j.data }, threadID, messageID);
		} catch (error) {
			const s = await new Promise(resolve => {
				yazky.sendMessage(`An error occurred: ${error.message}`, threadID, (err, info) => {
					resolve(info);
				});
			});
			setTimeout(() => {
				yazky.unsendMessage(s.messageID);
			}, 5000);
			return;
		}
	}
};

const wrapper = new GoatWrapper(module.exports);
wrapper.applyNoPrefix({ allowPrefix: true });