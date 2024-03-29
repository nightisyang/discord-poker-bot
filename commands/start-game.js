const fs = require("fs");
const path = require("node:path");

const { SlashCommandBuilder } = require("@discordjs/builders");
const { json } = require("express");

// const { initGameSession, parseCommand } = require("../game/poker.js");

// const poker = require("../game/poker.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("start-game")
    .setDescription(
      "Lets play! Use /new-poker-game to create a new #game channel to play."
    ),
  async execute(interaction) {
    // find poker category
    pokerCategory = interaction.guild.channels.cache.find(
      (type) => type.type === "GUILD_CATEGORY" && type.name === "Poker"
    );

    let channel = interaction.channel;

    const pokerPath = path.join(__dirname, "..", "game", `${channel.id}.js`);
    const gameCommsPath = path.join(
      __dirname,
      "..",
      "gameComms",
      `${channel.id}.js`
    );

    fs.copyFileSync(path.join(__dirname, "..", "game", "poker.js"), pokerPath);
    fs.copyFileSync(
      path.join(__dirname, "..", "gameComms", "gameMsg.js"),
      gameCommsPath
    );

    const { fetchChannel } = require(gameCommsPath);

    fetchChannel(channel);

    const {
      initPlayersId,
      initGameSessionId,
      initGameSession,
      initGamemaster,
      fetchGameState,
      startNewGame,
    } = require(pokerPath);

    initGameSessionId(channel.id);

    const gameState = fetchGameState();

    if (gameState !== 0) {
      interaction.reply(
        `Game session is on-going. Game Master has access to !endgame to force end this session.`
      );
      return;
    }

    const filePath = path.join(
      __dirname,
      "..",
      "gameSession",
      `${channel.id}.json`
    );

    const json = fs.readFileSync(filePath, "utf8", (err, data) => {
      if (err) {
        console.error(err);
        interaction.reply(
          `Game session doesn't exist, please use /start-game only in #game channels`
        );
        return;
      }
    });

    if (channel.name === "game" && channel.parentId === pokerCategory.id) {
      // file path of game sessions

      const jsonObj = JSON.parse(json);

      let botId;

      const players = channel.messages
        .fetch(jsonObj.embedMsgId)
        .then((msg) => {
          botId = msg.author.id;
          return msg.reactions.resolve("✅").users.fetch();
        })
        .then((users) => {
          let usersArr = [];

          users.forEach((value, key, map) => {
            if (key !== botId) {
              usersArr.push(value);
            }
          });

          // console.log(userID);

          if (usersArr.length < 2) {
            if (!usersArr.length) {
              channel.send({ content: `No one is playing :(` });
            } else {
              channel.send({
                content: `Get more friends, you need more than 1 player`,
              });
            }
            return;
          }

          if (usersArr.length > 10) {
            channel.send({
              content: `Get some one to leave (and remove react), game can't have more than 10 players (excluding bot)`,
            });
            return;
          }

          // console.log(userID);
          return usersArr;
        })
        .then((usersArr) => {
          // const pokerPath = path.join(__dirname, "..", "game", "poker.js");

          if (usersArr != null) {
            channel.send({ content: "Setting up game, get ready!" });

            initGamemaster(interaction.user.id);

            channel.send({
              content: `<@${interaction.user.id}> you're the Game Master! You have access to "!kick @player" & "!endgame"! `,
            });

            usersArr.forEach((user) => initPlayersId(user));
            // initPlayersId(...userID);
            initGameSession();

            if (gameState === 12) {
              startNewGame();
            }
          } else {
            return;
          }
        });

      // const reaction = msg.reactions;
      // console.log(reaction);

      /*
      let reacted = [];

      for (const user of reaction.users.values()) {
        const data = user.id;
        reacted.push(data);
      }

      jsonObj.players = reacted;

      console.log(jsonObj);

      fs.writeFileSync(filePath, jsonData, { encoding: "utf-8" }, (err) => {
        if (err) console.log(err);
        else {
          console.log("File written successfully\n");
          console.log("The written has the following contents:");
          console.log(fs.readFileSync(filePath, "utf8"));
        }
      }).catch(console.error);
*/
      // read contents of folder

      // read game session folder
      // get game session json
      // get embededMsgId
      // get reaction count and user except for bot
      // pass the data into game - userID and playerCount

      // await interaction.reply(`Setting up game, get ready!`);
    }
  },
};
