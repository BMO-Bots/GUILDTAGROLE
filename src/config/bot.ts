import { GatewayIntentBits, Partials, ActivityType } from 'discord.js';
import { BotConfig } from '../types';

export const botConfig: BotConfig = {
  token: process.env.DISCORD_TOKEN || ''
};

export const clientOptions = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction
  ]
};

export const defaultActivity = {
  name: 'Discord Server',
  type: ActivityType.Watching
};

export const validateConfig = (): boolean => {
  if (!botConfig.token) {
    console.error('❌ DISCORD_TOKEN environment variable is required!');
    return false;
  }
  return true;
}; 