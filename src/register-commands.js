import { REST, Routes, SlashCommandBuilder } from "discord.js";
import { config, requireConfig } from "./config.js";

requireConfig(["discordToken", "discordClientId"]);

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
} else {
  await rest.put(Routes.applicationCommands(config.discordClientId), { body: commands });
  console.log("Registered global slash commands. Discord may take up to 1 hour to show them.");
}
