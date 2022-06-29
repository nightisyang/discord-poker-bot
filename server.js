const express = require("express");
const Discord = require("discord.js");
const dotenv = require("dotenv");
const fs = require("node:fs");
const path = require("node:path");
const { parseCommand } = require("./game/poker.js");

const app = require("./app");
const port = 3001;
const { Client, Collection, Intents } = require("discord.js");
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
client.commands = new Collection();
const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  // Set a new item in the Collection
  // With the key as the command name and the value as the exported module
  client.commands.set(command.data.name, command);
}

dotenv.config({ path: "./config.env" });

//The client.on() is used to check for events.  It accepts an event name, and then a callback function to be called when the event takes place. In this code, the ready event is called when the bot is ready to start being used. Then, when the Discord server has a new message, the message event is called.

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return false;

  console.log(`Message from ${message.author.username}: ${message.content}`);

  if (message.content === "ping") {
    message
      .reply({ content: "This is a reply!" })
      .then(() => console.log(`Replied to message "${message.content}"`))
      .catch(console.error);
  }

  if (
    message.content.includes("!bet") ||
    message.content.includes("!call") ||
    message.content.includes("!allin") ||
    message.content.includes("!fold")
  ) {
    message
      .reply({ content: "Bot recieves bet!" })
      .then(() => {
        console.log(message.channel.id, message.author.id, message.content);
        parseCommand(message.channel.id, message.author.id, message.content);
        console.log(`Replied to message "${message.content}"`);
      })
      .catch(console.error);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName);

  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

//It gets the token from out .env file.
client.login(process.env.TOKEN);

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => {
  console.log(`Discord bot is listening on port ${port}`);
});

const gameComms = async function (gameSession, playerID, message) {
  const channel = await client.channel.fetch(gameSession);
  channel.send({ content: `${playerID} ${message}` });
};

module.exports = { gameComms };
