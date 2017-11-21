const TelegramBot = require('node-telegram-bot-api');
var app = require('express')();

const token = process.env.TOKEN;
var port = process.env.PORT || 8443;
const bot = new TelegramBot(token, {polling: true});
var port = process.env.PORT || 8080;
var io = require('socket.io').listen(app.listen(port));


// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  
  console.log(msg);

  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for 'photos'.
bot.on('photo', (msg) => {
  console.log(msg);
  
  const chatId = process.env.CHATID; // Group ID;
  if (msg.chat.id === msg.from.id) { // Only forward messages from real people
      // Send the photo to the group
      bot.sendPhoto(chatId, msg.photo[msg.photo.length-1].file_id);
  }
});

// Listen for 'videos'.
bot.on('video', (msg) => {
  console.log(msg);
  
  const chatId = process.env.CHATID; // Group ID;
  if (msg.chat.id === msg.from.id) { // Only forward messages from real people
    bot.sendVideo(chatId, msg.video.file_id);
  }
});
