import { Client } from 'discord.js';
import { ExtendedClient, ReadyEventData } from '../types';
import { defaultActivity } from '../config/bot';

export const readyEvent = {
  name: 'ready' as const,
  once: true,
  execute: (client: Client<true>): void => {
    const extendedClient = client as ExtendedClient;
    
    const eventData: ReadyEventData = {
      client: extendedClient,
      guilds: client.guilds.cache.size,
      users: client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
    };

    console.log('🚀 Bot is ready!');
    console.log(`📝 Logged in as: ${client.user.tag}`);
    console.log(`🏠 Active in ${eventData.guilds} guild(s)`);
    console.log(`👥 Serving ${eventData.users} users`);
  }
}; 