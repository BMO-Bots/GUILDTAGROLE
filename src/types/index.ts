import { Client } from 'discord.js';

export interface BotConfig {
  token: string;
  clientId?: string;
  guildId?: string;
}

export interface ExtendedClient extends Client {
  config: BotConfig;
}

export interface ReadyEventData {
  client: ExtendedClient;
  guilds: number;
  users: number;
}

export interface ErrorEventData {
  error: Error;
  source: 'client' | 'process' | 'unhandledRejection';
} 