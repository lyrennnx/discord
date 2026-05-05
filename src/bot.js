import { Client, Events, GatewayIntentBits, REST, Routes, SlashCommandBuilder } from "discord.js";
import { bypassLink } from "./bypassTools.js";
import { config, requireConfig } from "./config.js";

requireConfig(["discordToken", "discordClientId", "bypassApiKey"]);

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName("bypass")
      .setDescription("Resolve a supported ad-link through the bypass.tools API.")
      .addStringOption((option) =>
        option
          .setName("url")
          .setDescription("The supported URL to resolve.")
          .setRequired(true)
      )
      .toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(config.discordToken);

  if (config.discordGuildId) {
    await rest.put(
      Routes.applicationGuildCommands(config.discordClientId, config.discordGuildId),
      { body: commands }
    );
    console.log("Registered guild slash commands.");
    return;
  }

  await rest.put(Routes.applicationCommands(config.discordClientId), { body: commands });
  console.log("Registered global slash commands. Discord may take up to 1 hour to show them.");
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand() || interaction.commandName !== "bypass") {
    return;
  }

  const url = interaction.options.getString("url", true);

  await interaction.deferReply({ ephemeral: true });

  try {
    const bypassed = await bypassLink(url);

    await interaction.editReply({
      content: [
        "Bypass complete.",
        "",
        `Original: ${bypassed.originalUrl}`,
        `Result: ${bypassed.result}`
      ].join("\n")
    });
  } catch (error) {
    await interaction.editReply({
      content: `Could not bypass that link: ${error.message}`
    });
  }
});

await registerCommands();
client.login(config.discordToken);
