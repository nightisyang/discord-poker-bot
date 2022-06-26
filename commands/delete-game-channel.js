const fs = require("fs");
const path = require("node:path");

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("delete-game-channel")
    .setDescription("Deletes all #game channels!"),
  async execute(interaction) {
    await interaction.guild.channels.cache.forEach((channel) => {
      // find poker category
      pokerCategory = interaction.guild.channels.cache.find(
        (type) => type.type === "GUILD_CATEGORY" && type.name === "Poker"
      );

      // Remove all game channels
      if (
        channel.name === "game" &&
        channel.parentId === pokerCategory.id &&
        channel.author.id === "988312167902236672"
      ) {
        channel.delete();

        // folder path where game session data are kept
        const folderPath = path.join(__dirname, "..", "gameSession");

        // file path of game sessions
        const filePath = path.join(
          __dirname,
          "..",
          "gameSession",
          `${channel.id}.json`
        );

        // read contents of folder
        fs.readdir(folderPath, (err, files) => {
          if (err) console.log(err);
          else {
            // looping through each file
            files.forEach((file) => {
              // removing extension name to get filename that's based on channelId
              const filename = file.substring(0, file.lastIndexOf("."));

              // if channel.id is the same as filaname - delete file
              if ((channel.id = filename)) {
                fs.unlink(filePath, (err) => {
                  if (err) {
                    console.error(err);
                    return;
                  }
                });
              }
            });
          }
        });
      }
    });

    await interaction.reply(`All game channels deleted!`);
  },
};
