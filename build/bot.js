"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grammy_1 = require("grammy");
const files_1 = require("@grammyjs/files");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const conversations_1 = require("@grammyjs/conversations");
// const token = "6075339928:AAEDTCpdUpYsRsyK-RYY8PXGG8_5-MDGlVo";
const token = process.env.BOT_TOKEN;
if (!token)
    throw new Error("BOT_TOKEN is unset");
// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new grammy_1.Bot(token); // <-- put your bot token between the ""
bot.use((0, grammy_1.session)({ initial: () => ({}) }));
bot.use((0, conversations_1.conversations)());
bot.use((0, conversations_1.conversations)());
bot.api.config.use((0, files_1.hydrateFiles)(bot.token));
bot.use((0, conversations_1.createConversation)(greeting));
bot.command("start", async (ctx) => console.log("Started"));
bot.command("add", async (ctx) => {
    await ctx.conversation.enter("greeting");
});
async function greeting(conversation, ctx) {
    var _a, _b, _c;
    const fileName = ((_b = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.text) === null || _b === void 0 ? void 0 : _b.replace("/add ", "")) || "Untitled";
    const fileCtx = await conversation.waitFor(":voice");
    await handleFile(fileName, fileCtx, (_c = ctx.message) === null || _c === void 0 ? void 0 : _c.message_id);
}
async function handleFile(fileName, ctx, replyId) {
    const file = await ctx.getFile();
    const filePath = await file.download(path_1.default.join(__dirname, `../audios/${fileName}.mp3`));
    await ctx.replyWithAudio(new grammy_1.InputFile((0, fs_1.createReadStream)(filePath)), {
        title: fileName,
        reply_to_message_id: replyId,
    });
    await ctx.deleteMessage();
}
// bot.start();
exports.default = (0, grammy_1.webhookCallback)(bot, "http");
