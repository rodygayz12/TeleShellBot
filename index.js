const http = require('http');
const TeleBot = require('telebot');
const { spawn } = require('child_process');

const config = require('./config').config();
const { botToken, adminUsers } = config;

const bot = new TeleBot(botToken);

// Create an HTTP server to listen on port 8080
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(8080, () => {
  console.log('Server running at http://localhost:8080');
});

bot.on('text', (msg) => {
  const { id } = msg.from;
  msg.reply.text('$:' + msg.text);
  if (!adminUsers.includes(id)) {
    msg.reply.text('You are not admin!');
    return;
  }
  const words = msg.text.split(' ');
  const len = words.length;
  let args = [];
  if (len > 1) {
    args = words.slice(1, len);
  }
  console.log('args:' + args);

  const shell = spawn(words[0], args).on('error', (err) => {
    msg.reply.text('error while executing:' + words[0]);
    msg.reply.text(err);
  });

  if (shell) {
    shell.stdout.on('data', (data) => {
      msg.reply.text(`stdout:\n ${data}`);
    });

    shell.stderr.on('data', (data) => {
      msg.reply.text(`stderr: ${data}`);
    });

    shell.on('close', (code) => {
      msg.reply.text(`shell exited with code ${code}`);
    });
  }
});

bot.start();
