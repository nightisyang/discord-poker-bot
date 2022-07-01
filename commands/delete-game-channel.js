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
        channel.parentId === pokerCategory.id
        //  && channel.author.id === "988312167902236672"
      ) {
        // console.log(channel);
        channel.delete();

        // folder path where game session data are kept
        const gameSessionFolderPath = path.join(__dirname, "..", "gameSession");
        const gameJsFolderPath = path.join(__dirname, "..", "game");

        const deleteFile = function (folderPath) {
          let filePath;
          fs.readdir(folderPath, (err, files) => {
            // file path of game sessions
            if (folderPath === gameSessionFolderPath) {
              filePath = path.join(folderPath, `${channel.id}.json`);
            }

            if (folderPath === gameJsFolderPath) {
              filePath = path.join(folderPath, `${channel.id}.js`);
            }

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
        };

        deleteFile(gameSessionFolderPath);
        deleteFile(gameJsFolderPath);

        // read contents of folder
        // fs.readdir(folderPath, (err, files) => {
        //   if (err) console.log(err);
        //   else {
        //     // looping through each file
        //     files.forEach((file) => {
        //       // removing extension name to get filename that's based on channelId
        //       const filename = file.substring(0, file.lastIndexOf("."));

        //       // if channel.id is the same as filaname - delete file
        //       if ((channel.id = filename)) {
        //         fs.unlink(filePath, (err) => {
        //           if (err) {
        //             console.error(err);
        //             return;
        //           }
        //         });
        //       }
        //     });
        //   }
        // });
      }
    });

    await interaction.reply(`All game channels deleted!`);
  },
};
