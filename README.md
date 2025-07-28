# Discord Guild Tag Role Bot

Bot Discord che assegna e rimuove automaticamente un ruolo agli utenti in base all'identità principale del loro server (guild tag)

## Funzionalità
- Assegna un ruolo quando un utente imposta la tua guild come identità principale
- Rimuove il ruolo se l'utente cambia identità principale

## Requisiti
- Node.js 18+ **oppure** Bun
- Un bot Discord e il suo token
- ID del server (guild) e del ruolo da gestire

## Configurazione
1. **Clona il repository**
   ```sh
   git clone https://github.com/BMO-Bots/GUILDTAGROLE
   cd GUILDTAGROLE
   ```
2. **Installa le dipendenze**
   ```sh
   bun install
   # oppure
   npm install
   ```
3. **Crea un file `.env`** nella root con:
   ```env
   DISCORD_TOKEN=il_tuo_token
   GUILD_ID=il_tuo_guild_id
   ROLE_ID=il_tuo_role_id
   ```

## Avvio locale
- Con Bun:
  ```sh
  bun bot.ts
  ```
- Con Node.js (dopo build):
  ```sh
  bun build bot.ts --outdir dist --target node
  node dist/bot.js
  ```