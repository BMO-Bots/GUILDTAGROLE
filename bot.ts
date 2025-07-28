// Tutto il bot in un unico file TypeScript
import 'dotenv/config';
import { Client, GatewayDispatchEvents, GatewayIntentBits, Partials, ActivityType } from 'discord.js';

// Tipi
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

// Configurazione
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
  name: 'Server Discord',
  type: ActivityType.Watching
};

export const validateConfig = (): boolean => {
  if (!botConfig.token) {
    console.error('❌ La variabile d’ambiente DISCORD_TOKEN è obbligatoria!');
    return false;
  }
  return true;
};

// Eventi
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
    console.log('🚀 Il bot è pronto!');
    console.log(`📝 Connesso come: ${client.user.tag}`);
    console.log(`🏠 Attivo in ${eventData.guilds} server`);
    console.log(`👥 Sta servendo ${eventData.users} utenti`);
    // Status gestito da altro script
  }
};

export const errorEvent = {
  name: 'error' as const,
  execute: (error: Error): void => {
    const errorData: ErrorEventData = {
      error,
      source: 'client'
    };
    console.error('❌ Errore del client Discord:');
    console.error(`📍 Fonte: ${errorData.source}`);
    console.error(`💬 Messaggio: ${errorData.error.message}`);
    console.error(`📚 Stack: ${errorData.error.stack}`);
  }
};

export const setupProcessErrorHandlers = (): void => {
  process.on('unhandledRejection', (error: Error) => {
    const errorData: ErrorEventData = {
      error,
      source: 'unhandledRejection'
    };
    console.error('❌ Promessa non gestita (Unhandled Promise Rejection):');
    console.error(`📍 Fonte: ${errorData.source}`);
    console.error(`💬 Messaggio: ${errorData.error.message}`);
    console.error(`📚 Stack: ${errorData.error.stack}`);
  });
  process.on('uncaughtException', (error: Error) => {
    const errorData: ErrorEventData = {
      error,
      source: 'process'
    };
    console.error('❌ Eccezione non gestita (Uncaught Exception):');
    console.error(`📍 Fonte: ${errorData.source}`);
    console.error(`💬 Messaggio: ${errorData.error.message}`);
    console.error(`📚 Stack: ${errorData.error.stack}`);
    process.exit(1);
  });
};

export const handleGuildMemberUpdate = async (data: any, client: Client): Promise<void> => {
  if (!process.env.GUILD_ID) {
    console.error('La variabile d’ambiente GUILD_ID non è impostata');
    return;
  }
  if (data.guild_id !== process.env.GUILD_ID) {
    return;
  };
  const userClan = data.user?.primary_guild;
  console.log(`L’utente ${data.user.id} ha clan: ${userClan ? userClan.tag : "Nessun clan"}`);
  const shouldHavePerks = userClan?.identity_guild_id === process.env.GUILD_ID;
  console.log(`L’utente ${data.user.id} deve avere i privilegi: ${shouldHavePerks}`);
  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) {
    console.log(`Server ${data.guild_id} non trovato.`);
    return;
  }
  let member = guild.members.cache.get(data.user.id);
  if (!member) {
    try {
      member = await guild.members.fetch(data.user.id);
    } catch (error) {
      console.error('Utente non trovato nel server');
      return;
    }
  }
  if (process.env.ROLE_ID) {
    const hasRole = member.roles.cache.has(process.env.ROLE_ID);
    if (shouldHavePerks && !hasRole) {
      try {
        await member.roles.add(process.env.ROLE_ID);
        console.log(`Ruolo ${process.env.ROLE_ID} aggiunto a ${member.user.username} per corrispondenza identità server`);
      } catch (error) {
        console.error('Impossibile aggiungere il ruolo:', error);
      }
    } else if (!shouldHavePerks && hasRole) {
      try {
        await member.roles.remove(process.env.ROLE_ID);
        console.log(`Ruolo ${process.env.ROLE_ID} rimosso da ${member.user.username} - identità server non corrispondente`);
      } catch (error) {
        console.error('Impossibile rimuovere il ruolo:', error);
      }
    }
  }
};

// Main
const initializeBot = async (): Promise<void> => {
  if (!validateConfig()) {
    process.exit(1);
  }
  console.log('🔧 Inizializzazione del bot Discord...');
  const client = new Client(clientOptions) as ExtendedClient;
  client.config = botConfig;
  setupProcessErrorHandlers();
  client.once(readyEvent.name, readyEvent.execute);
  client.on(errorEvent.name, errorEvent.execute);
  client.ws.on(GatewayDispatchEvents.GuildMemberUpdate, async (data) => {
    await handleGuildMemberUpdate(data, client);
  });
  try {
    console.log('🔐 Connessione a Discord in corso...');
    await client.login(botConfig.token);
  } catch (error) {
    console.error('❌ Connessione a Discord fallita:');
    console.error(error);
    process.exit(1);
  }
};

initializeBot().catch((error: Error) => {
  console.error('❌ Inizializzazione del bot fallita:');
  console.error(error);
  process.exit(1);
});
