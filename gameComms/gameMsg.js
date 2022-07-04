const fs = require("fs");
const path = require("node:path");
const Discord = require("discord.js");
const { Client, Collection, Intents } = require("discord.js");
const dotenv = require("dotenv");

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

let channelBackUp;

dotenv.config({ path: "./config.env" });

const fetchChannel = function (channel) {
  channelBackUp = channel;
};

const channelMsg = async function (message, playerID, gameSession) {
  if (channelBackUp !== undefined) {
    if (channelBackUp.id === gameSession) {
      if (playerID == null) {
        channelBackUp.send({ content: `${message}` });
      } else {
        channelBackUp.send({ content: `<@${playerID}> ${message}` });
      }
    }
  } else {
    await client.channels.fetch(gameSession).then((channel) => {
      if (channelBackUp !== channel.id) {
        channelBackUp = channel;
      }

      if (playerID == null) {
        channel.send({ content: `${message}` });
      } else {
        channel.send({ content: `<@${playerID}> ${message}` });
      }
    });
  }

  //   console.log(message, playerID, gameSession);
  //   await client.channels
  //     .fetch(gameSession)
  //     .then((channel) => channel.send({ content: `<@${playerID}> ${message}` }));
};

// const fetchUsername = async function (playerId) {
//   let username;
//   await client.users.fetch(playerId).then((player) => {
//     console.log(player);
//     username = player.username;
//   });

//   console.log(username);
//   return username;
// };

const directMsg = async function (message, playerID, gameSessionId) {
  client.users
    .fetch(playerID)
    .then((user) =>
      user.send({ content: `${message} at <#${gameSessionId}>` })
    );
};

const embedTableMsg = async function (embed, gameSessionId) {
  await client.channels.fetch(gameSessionId).then((channel) => {
    channel.send({ embeds: [embed] });
  });
};

const embedNewGame = async function (embed, gameSessionId) {
  let embedMsgId;
  let channelId;

  await client.channels.fetch(gameSessionId).then((channel) => {
    channelId = channel.id;
    channel
      .send({ embeds: [embed] })
      .then((embedMsg) => {
        embedMsg.react("✅");

        return embedMsg;
      })
      .then((embedMsg) => (embedMsgId = embedMsg.id));
  });

  const filePath = path.join(
    __dirname,
    "..",
    "gameSession",
    `${channelId}.json`
  );

  const json = fs.readFileSync(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
  });

  const jsonObj = JSON.parse(json);
  jsonObj.embedMsgId = embedMsgId;
  fs.writeFileSync(
    filePath,
    JSON.stringify(jsonObj),
    { encoding: "utf-8" },
    (err) => {
      if (err) console.log(err);
      else {
        console.log("json.embdedMsgId updated!\n");
      }
    }
  );
};

client.login(process.env.TOKEN);

module.exports = {
  fetchChannel,
  channelMsg,
  directMsg,
  embedTableMsg,
  embedNewGame,
};
