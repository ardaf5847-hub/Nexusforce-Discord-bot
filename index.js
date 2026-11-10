
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder
} = require("discord.js");

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

if (!token) {
  console.error("DISCORD_TOKEN fehlt!");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const commands = [
  new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Prüft, ob der Nexusforce-Bot online ist.")
    .toJSON()
];

client.once("ready", async () => {
  console.log(`Nexusforce Bot online: ${client.user.tag}`);

  if (clientId && guildId) {
    const rest = new REST({ version: "10" }).setToken(token);

    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    console.log("Befehle registriert!");
  }
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "ping") {
    await interaction.reply({
      content: "Pong! 🟢 Nexusforce Bot ist online.",
      ephemeral: true
    });
  }
});

client.login(token);
