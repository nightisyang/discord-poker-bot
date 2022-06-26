const fs = require("fs");
const path = require("node:path");

const { SlashCommandBuilder } = require("@discordjs/builders");
const Discord = require("discord.js");
const dotenv = require("dotenv");
const { Client, Collection, Intents, MessageEmbed } = require("discord.js");
const { start } = require("repl");
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    "DIRECT_MESSAGES",
    "DIRECT_MESSAGE_REACTIONS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
    "GUILDS",
  ],
});

dotenv.config({ path: "./config.env" });
client.login(process.env.TOKEN);

module.exports = {
  data: new SlashCommandBuilder()
    .setName("new-poker-game")
    .setDescription("Creates a new channel!"),
  async execute(interaction) {
    // embedded message
    const embed = new Discord.MessageEmbed()
      .setColor("#0099ff")
      .setTitle("Texas Hold 'em Poker Bot.")
      .setURL("https://discord.js.org/")
      .setAuthor({
        name: "Some name",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
        url: "https://discord.js.org",
      })
      .setDescription(
        "Click on ✅ to join and use /start-game when players are ready."
      )
      .setThumbnail("https://i.imgur.com/AfFp7pu.png")
      .addFields(
        { name: "Regular field title", value: "Some value here" },
        { name: "\u200B", value: "\u200B" },
        { name: "Inline field title", value: "Some value here", inline: true },
        { name: "Inline field title", value: "Some value here", inline: true }
      )
      .addField("Inline field title", "Some value here", true)
      .setImage("https://i.imgur.com/AfFp7pu.png")
      .setTimestamp()
      .setFooter({
        text: "Some footer text here",
        iconURL: "https://i.imgur.com/AfFp7pu.png",
      });

    // find if category has been created
    pokerCategory = interaction.guild.channels.cache.find(
      (type) => type.type === "GUILD_CATEGORY" && type.name === "Poker"
    );

    const guildId = interaction.guild.id;

    // function to create game room
    const createGameChannel = async function (category) {
      let channelId;
      let channel;
      let embedMsgId;

      await category
        .createChannel("Game")
        .then(console.log("Game channel created"))
        .then((result) => {
          channelId = result.id;
          return client.channels.fetch(result.id);
        })
        .then((gameChannel) => {
          // id.send({ content: `hello world ${id}` });
          const sendEmbed = gameChannel.send({ embeds: [embed] });

          sendEmbed.then((embedMsg) => {
            embedMsg.react("✅");
          });

          channel = gameChannel;

          return sendEmbed;
        })
        .then((embedMsg) => (embedMsgId = embedMsg.id))
        .then(() => {
          const jsonData = JSON.stringify({
            guildId: guildId,
            channelId: channelId,
            embedMsgId: embedMsgId,
          });

          console.log(jsonData);
          const filePath = path.join(
            __dirname,
            "..",
            "gameSession",
            `${channelId}.json`
          );

          fs.writeFileSync(filePath, jsonData, { encoding: "utf-8" }, (err) => {
            if (err) console.log(err);
            else {
              console.log("File written successfully\n");
              console.log("The written has the following contents:");
              console.log(fs.readFileSync(filePath, "utf8"));
            }
          });
        })
        .catch(console.error);

      await interaction.reply(
        `${interaction.user.tag} created a new poker ${channel}`
      );
    };

    // condition if category exist, if it doesn't proceed to create category and game room
    if (pokerCategory) {
      console.log("Poker category exist, using exising category");

      createGameChannel(pokerCategory);
    } else {
      const createPokerCategory = await interaction.guild.channels.create(
        "Poker",
        {
          type: "GUILD_CATEGORY",
        }
      );

      createGameChannel(createPokerCategory);
    }
  },
};
