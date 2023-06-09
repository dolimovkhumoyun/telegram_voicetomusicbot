import { Bot, Context, InputFile, session, webhookCallback } from "grammy";
import { FileFlavor, hydrateFiles } from "@grammyjs/files";
import path from "path";
import { createReadStream, unlink } from "fs";
import { type Conversation, type ConversationFlavor, conversations, createConversation } from "@grammyjs/conversations";
const token = "6075339928:AAE1zImfHOlUtOzNhJ-EbUxroHcsaEhVh38";
// const token = process.env.BOT_TOKEN;

// type MyContext = FileFlavor<Context>;
type MyContext = ConversationFlavor & FileFlavor<Context>;
type MyConversation = Conversation<MyContext>;

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot<MyContext>(token); // <-- put your bot token between the ""
bot.use(session({ initial: () => ({}) }));
bot.use(conversations());

bot.use(conversations());
bot.api.config.use(hydrateFiles(bot.token));

bot.use(createConversation(greeting));
bot.command("start", async (ctx) => console.log("Started"));

bot.command("add", async (ctx) => {
  await ctx.conversation.enter("greeting");
});

async function greeting(conversation: MyConversation, ctx: MyContext) {
  const fileName = ctx.message?.text?.replace("/add ", "") || "Untitled";
  const fileCtx = await conversation.waitFor(":voice");

  await handleFile(fileName, fileCtx, ctx.message?.message_id);
}

async function handleFile(fileName: string, ctx: MyContext, replyId: number | undefined) {
  const file = await ctx.getFile();
  const pathF = path.join(__dirname, `../audios/${fileName}.mp3`);
  const filePath = await file.download(pathF);
  await ctx.replyWithAudio(new InputFile(createReadStream(filePath)), {
    title: fileName,
    reply_to_message_id: replyId,
  });
  await ctx.deleteMessage();
  unlink(pathF, (err) => {
    if (err) {
      console.log(err);
    }
  });
}

bot.start();

// export default webhookCallback(bot, "http");
