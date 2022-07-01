const embedTable = {
  color: 0x0099ff,
  title: "Texas Hold 'em Poker Bot.",
  url: "https://discord.js.org",
  author: {
    name: "Some name",
    icon_url: "https://i.imgur.com/AfFp7pu.png",
    url: "https://discord.js.org",
  },
  description:
    "Click on ✅ to join and use /start-game when players are ready.",
  thumbnail: {
    url: "https://i.imgur.com/AfFp7pu.png",
  },
  fields: [
    {
      name: "Regular field title", // Dealer
      value: "Some value here", // Pot size
      inline: true,
    },
    {
      name: "Regular field title", // Community Cards
      value: "Some value here", // Community Cards
      inline: true,
    },
    {
      name: "Regular field title", // Call
      value: "Some value here", // min call
      inline: true,
    },
    {
      name: "\u200b",
      value: "\u200b",
      inline: false,
    },
    {
      name: "Inline field title", // player id/name Current Bet/Balance
      value: "Some value here", // Current Bet/Balance
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
    {
      name: "Inline field title",
      value: "Some value here",
      inline: true,
    },
  ],
  image: {
    url: "https://i.imgur.com/AfFp7pu.png",
  },
  timestamp: new Date(),
  footer: {
    text: "Some footer text here",
    icon_url: "https://i.imgur.com/AfFp7pu.png",
  },
};

module.exports = { embedTable };

// channel.send({ embeds: [exampleEmbed] });
