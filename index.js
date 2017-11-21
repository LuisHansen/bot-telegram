const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TOKEN;
var port = process.env.PORT || 8080;

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
const bot = new TelegramBot(token, {polling: true});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

// Matches "/echo [whatever]"
bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1]; // the captured "whatever"
  // send back the matched "whatever" to the chat
  bot.sendMessage(chatId, resp);
});

// Listen for 'photos'.
bot.on('photo', (msg) => {  
  const chatId = process.env.CHATID; // Group ID;
  if (msg.chat.id === msg.from.id) { // Only forward messages from real people
      // Send the photo to the group
      bot.sendPhoto(chatId, msg.photo[msg.photo.length-1].file_id);
  }
});

// Listen for 'videos'.
bot.on('video', (msg) => {  
  const chatId = process.env.CHATID; // Group ID;
  if (msg.chat.id === msg.from.id) { // Only forward messages from real people
    bot.sendVideo(chatId, msg.video.file_id);
  }
});
