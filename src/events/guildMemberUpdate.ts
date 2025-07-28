import { Client } from 'discord.js';

export const handleGuildMemberUpdate = async (data: any, client: Client): Promise<void> => {
  if (!process.env.GUILD_ID) {
    console.error('GUILD_ID environment variable not set');
    return;
  }

  if (data.guild_id !== process.env.GUILD_ID) {
    return;
  };

  const userClan = data.user?.primary_guild;
  console.log(`User ${data.user.id} has clan: ${userClan ? userClan.tag : "No clan"}`);

  // Se il clan è null o "nessuno", togli SEMPRE il ruolo
  if (!userClan || !userClan.tag || userClan.tag.toLowerCase() === 'nessuno') {
    const guild = client.guilds.cache.get(data.guild_id);
    if (!guild) {
      console.log(`Guild ${data.guild_id} not found.`);
      return;
    }
    let member = guild.members.cache.get(data.user.id);
    if (!member) {
      try {
        member = await guild.members.fetch(data.user.id);
      } catch (error) {
        console.error('Member not found in guild');
        return;
      }
    }
    if (process.env.ROLE_ID && member.roles.cache.has(process.env.ROLE_ID)) {
      try {
        await member.roles.remove(process.env.ROLE_ID);
        console.log(`Role ${process.env.ROLE_ID} removed from ${member.user.username} (no clan/null/nessuno)`);
      } catch (error) {
        console.error('Failed to remove role:', error);
      }
    }
    return;
  }

  const shouldHavePerks = userClan?.identity_guild_id === process.env.GUILD_ID;
  console.log(`User ${data.user.id} should have perks: ${shouldHavePerks}`);

  const guild = client.guilds.cache.get(data.guild_id);
  if (!guild) {
    console.log(`Guild ${data.guild_id} not found.`);
    return;
  }

  let member = guild.members.cache.get(data.user.id);
  if (!member) {
    try {
      member = await guild.members.fetch(data.user.id);
    } catch (error) {
      console.error('Member not found in guild');
      return;
    }
  }

  if (process.env.ROLE_ID) {
    const hasRole = member.roles.cache.has(process.env.ROLE_ID);

    if (shouldHavePerks && !hasRole) {
      try {
        await member.roles.add(process.env.ROLE_ID);
        console.log(`Role ${process.env.ROLE_ID} added to ${member.user.username} for guild identity match`);
      } catch (error) {
        console.error('Failed to add role:', error);
      }
    } else if (!shouldHavePerks && hasRole) {
      try {
        await member.roles.remove(process.env.ROLE_ID);
        console.log(`Role ${process.env.ROLE_ID} removed from ${member.user.username} - guild identity mismatch`);
      } catch (error) {
        console.error('Failed to remove role:', error);
      }
    }
  }
};
