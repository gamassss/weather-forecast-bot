# weather-forecast-bot
-Bot untuk memberi tau kapan hujan pada jam terdekat pada saat memanggil bot ini.
-A bot to inform about the nearest rain time when calling this bot.

### Follow the steps below to have this bot on your Discord server.

# Install NodeJS
-You need to install [NodeJS](https://nodejs.org/en/) first.

# Setup Discord Developer
1. Visit [Discord Developer Portal](https://discord.com/login?redirect_to=%2Fdevelopers)
2. New Application -> Name your app -> Create
3. Open **Bot** on the sidebar -> Reset Token -> Copy the token and paste it somewhere
-> Scroll and enable **MESSAGE CONTENT INTENT** option at **Privileged Gateway Intents** section
4. Open **OAuth2** on the sidebar -> URL Generator -> Copy client id and paste it somewhere
-> on Scopes section, check **bot** and **applications.commands**
5. On **bot permissions** section, check **Read Messages/View Channels, Send Messages, Use slash commands**
6. Copy generated URL below the bot permissions section, open it on a new tab
7. Verify and confirm the bot permissions for you server.

# Clone This Repo and Run
1. Clone this repo
```
git clone https://github.com/gamassss/weather-forecast-bot.git
```

2. Go to key.json file. Replace all values with what you have.
3. To get your guild id: Go to User Settings -> Advanced -> Enable developer mode -> Right Click on your discord server -> Copy ID
4. Last, run you bot by type this on your terminal `npm run start`
### Voila now your bot is online.
The bot takes one mandatory option for your location's name. 😁
Give a star to this repo if it's helpful # ⭐

