# bypass.tools Discord Bot

A small Discord slash-command bot that sends a URL to the `bypass.tools` API and returns the resolved result.

Use it only for links you own, have permission to process, or are allowed to resolve under the relevant service terms.

## Setup

1. Install Node.js 20 or newer.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env` and fill in the values.

   ```env
   DISCORD_TOKEN=your_discord_bot_token
   DISCORD_CLIENT_ID=your_discord_application_client_id
   DISCORD_GUILD_ID=optional_test_server_id_for_fast_command_updates
   BYPASS_TOOLS_API_KEY=your_bypass_tools_api_key
   BYPASS_TOOLS_API_URL=https://bypass.tools/api/bypass
   ```

4. Register the `/bypass` command:

   ```bash
   npm run register
   ```

5. Start the bot:

   ```bash
   npm start
   ```

## Notes

- Keep your Discord token and API key in `.env`. Do not put them in frontend code or commit them.
- `BYPASS_TOOLS_API_URL` is configurable because the public `bypass.tools` website advertises API access but does not show a complete public endpoint reference.
- If the API expects a different request shape, update `src/bypassTools.js`.
