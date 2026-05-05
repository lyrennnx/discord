export const config = {
  discordToken: process.env.DISCORD_TOKEN,
  discordClientId: process.env.DISCORD_CLIENT_ID,
  discordGuildId: process.env.DISCORD_GUILD_ID,
  bypassApiKey: process.env.BYPASS_TOOLS_API_KEY,
  bypassApiUrl: process.env.BYPASS_TOOLS_API_URL || "https://api.bypass.tools/bypass/direct"
};

export function requireConfig(keys) {
  const missing = keys.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment values: ${missing.join(", ")}`);
  }
}
