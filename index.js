const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require('cors');

const token = "6925638926:AAHW4XgPeYhVYPT2vMegKy6PTuNxbpwC5yc";

const webAppUrl = "https://tg-bot-vargas.netlify.app/";
// const webAppUrl = "https://localhost:3000/";
const bot = new TelegramBot(token, { polling: true });
const app = express();

app.use(express.json());
app.use(cors());


bot.on("message", async (msg) => {
   const chatId = msg.chat.id;
   const text = msg.text;
   
   if (text === "/start") {
      await bot.sendMessage(chatId, "Ниже кнопка заполни форму", {
         reply_markup: {
            keyboard: [
               [
                  {
                     text: "Заполни форму",
                     web_app: { url: webAppUrl + "/form" },
                  },
               ],
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
   if (msg?.web_app_data?.data) {
      try {
         const data = JSON.parse(msg?.web_app_data?.data);
         console.log(data);
         await bot.sendMessage(chatId, "Спасибо за обратную связь");
         await bot.sendMessage(chatId, "Ваша страна:" + data?.country);
         await bot.sendMessage(chatId, "Ваша улица:" + data?.street);
         setTimeout(async () => {
            await bot.sendMessage(
               chatId,
               "Вся информация будет в этом чате"
            );
         }, 3000);
      } catch (e) {
         console.log(e);
      }
   }
});

app.post('/web-data', async (req, res) => {
   const {queryId, products, totalPrice} = req.body;
   try {
      await bot.answerWebAppQuery(queryId,{
         type: 'article',
         id: queryId,
         title: 'Успешная покупка',
         input_message_content: {message_text: `
         Поздравляю с покупкой на ${totalPrice}₽,
         ${products.map(item => item.title.join(', '))}
         `},
      });
      return res.status(200).json({});
   } catch (e) {
      await bot.answerWebAppQuery(queryId,{
         type: 'article',
         id: queryId,
         title: 'Покупка не удалась(',
         input_message_content: {message_text: 'Не удалось купить товар('},
      });
      return res.status(500).json({});
   }
})

const PORT = 3000;
app.listen(PORT, () => console.log('server started on PORT' + PORT));