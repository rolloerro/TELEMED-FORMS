require('dotenv').config();
const { Telegraf } = require('telegraf');
const puppeteer = require('puppeteer');
const fs = require('fs');

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start(ctx => {
  ctx.reply(
    '🩺 TELEMED-FORMS\n\nВыберите действие:',
    {
      reply_markup: {
        keyboard: [
          ['📄 Сформировать согласие'],
          ['📋 Протокол консультации'],
        ],
        resize_keyboard: true
      }
    }
  );
});

bot.hears('📄 Сформировать согласие', async (ctx) => {
  const html = `
    <h1>ИНФОРМИРОВАННОЕ СОГЛАСИЕ</h1>
    <p>Пациент: ${ctx.from.first_name}</p>
    <p>Дата: ${new Date().toLocaleDateString()}</p>
    <p>Я подтверждаю добровольное согласие на медицинское вмешательство.</p>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: 'consent.pdf' });
  await browser.close();

  await ctx.replyWithDocument({ source: 'consent.pdf' });
});

bot.hears('📋 Протокол консультации', async (ctx) => {
  const html = `
    <h1>ПРОТОКОЛ КОНСУЛЬТАЦИИ</h1>
    <p>Пациент: ${ctx.from.first_name}</p>
    <p>Жалобы: ...</p>
    <p>Рекомендации: ...</p>
  `;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html);
  await page.pdf({ path: 'protocol.pdf' });
  await browser.close();

  await ctx.replyWithDocument({ source: 'protocol.pdf' });
});

bot.launch();
console.log('🚀 TELEMED-FORMS запущен');
