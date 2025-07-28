import 'dotenv/config';

import express, { Request, Response } from 'express';
import { Client, GatewayDispatchEvents } from 'discord.js';
import { ExtendedClient } from './types';
import { botConfig, clientOptions, validateConfig } from './config/bot';
import { readyEvent } from './events/ready';
import { errorEvent, setupProcessErrorHandlers } from './events/error';
import { handleGuildMemberUpdate } from './events/guildMemberUpdate';

const PORT = process.env.PORT || 3000;

const initializeBot = async (): Promise<void> => {
  if (!validateConfig()) {
    process.exit(1);
  }

  console.log('🔧 Initializing Discord bot...');

  const client = new Client(clientOptions) as ExtendedClient;
  client.config = botConfig;

  setupProcessErrorHandlers();

  client.once(readyEvent.name, readyEvent.execute);
  client.on(errorEvent.name, errorEvent.execute);
  client.ws.on(GatewayDispatchEvents.GuildMemberUpdate, async (data) => {
    await handleGuildMemberUpdate(data, client);
  });

  // --- INIZIO SERVER EXPRESS ---
  const app = express();
  app.get('/', (_req: Request, res: Response) => res.send('Bot is running!'));
  app.listen(PORT, () => {
    console.log(`🌐 Web server listening on port ${PORT}`);
  });
  // --- FINE SERVER EXPRESS ---

  try {
    console.log('🔐 Logging in to Discord...');
    await client.login(botConfig.token);
  } catch (error) {
    console.error('❌ Failed to login to Discord:');
    console.error(error);
    process.exit(1);
  }
};

initializeBot().catch((error: Error) => {
  console.error('❌ Bot initialization failed:');
  console.error(error);
  process.exit(1);
});