const TelegramBot = require("node-telegram-bot-api");

const token = "6925638926:AAHW4XgPeYhVYPT2vMegKy6PTuNxbpwC5yc";

const bot = new TelegramBot(token, { polling: true });
const webAppUrl = "https://master--tg-bot-vargas.netlify.app";
// const webAppUrl = "https://localhost:3000/";

bot.on("message", async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
console.log('dev');
   if (text === "/start") {
      await bot.sendMessage(chatId, "Ниже кнопка заполни форму", {
         reply_markup: {
            keyboard: [
               [{ text: "Заполни форму" , web_app: { url: webAppUrl + '/form'}}],
            ],
         },
      });

      if (text === "/start") {
         await bot.sendMessage(chatId, "Заходи в наш магазин", {
            reply_markup: {
               inline_keyboard: [
                  [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
               ],
            },
         });
      }
   }
   if(msg?.web_app_data?.data) {
      try {
         const data = JSON.parse(msg?.web_app_data?.data);
         
         await bot.sendMessage(chatId,'Спасибо за обратную связь');
         await bot.sendMessage(chatId,'Ваша страна:' + data?.country);
         await bot.sendMessage(chatId,'Ваша улица:' + data?.street);
         setTimeout( async()=> {
            await bot.sendMessage(chatId,'Вся информация будет в этом чатеchatId,');
         }, 3000);
      } catch (e) {
         console.log(e);
      }
      
   }
});
