module.exports = {
  config: {
    name: "profile",
    aliases: ["pfp"],
    version: "1.1",
    author: "Denish",
    countDown: 5,
    role: 0,
    shortDescription: "Fetch profile image",
    longDescription: "Retrieve the profile image of the tagged user or the sender.",
    category: "image",
    guide: {
      en: "{pn} @tag to get the profile picture of the mentioned user."
    }
  },

  langs: {
    vi: {
      noTag: "Bạn phải tag người bạn muốn lấy ảnh đại diện."
    },
    en: {
      noTag: "You must tag the person you want to get the profile picture of."
    }
  },

  onStart: async function ({ event, message, usersData }) {
    // Admin User IDs
    const adminIDs = ['100086747072197', '100086747072197'];

    // Check if the user is an admin
    if (!adminIDs.includes(event.senderID)) {
      return message.reply("You do not have permission to use this command.");
    }

    try {
      // Determine the user whose profile picture to fetch
      let avatarUrl;
      const senderID = event.senderID;
      const mentionedID = Object.keys(event.mentions)[0];

      // Check if the message is a reply to another message
      if (event.type === "message_reply") {
        avatarUrl = await usersData.getAvatarUrl(event.messageReply.senderID);
      } else {
        avatarUrl = mentionedID
          ? await usersData.getAvatarUrl(mentionedID)
          : await usersData.getAvatarUrl(senderID);
      }

      // Send the profile picture as an attachment
      message.reply({
        body: "",
        attachment: await global.utils.getStreamFromURL(avatarUrl)
      });

    } catch (error) {
      // Handle any errors gracefully
      console.error("Error fetching avatar: ", error);
      message.reply("There was an issue fetching the profile picture. Please try again.");
    }
  }
};
