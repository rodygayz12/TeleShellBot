const http = require('http');
const TeleBot = require('telebot');

const config = require('./config').config();
const { botToken, adminUsers } = config;

const bot = new TeleBot(botToken);

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running!');
});

server.listen(80, () => {
  console.log('Server running at http://localhost:80');
});

bot.on('text', (msg) => {
  // ... Your existing bot logic here
});

bot.start();
