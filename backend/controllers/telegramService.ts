import { StringSession } from "telegram/sessions";
import input from "input";
import fs from "fs";

const apiId: number = parseInt(process.env.TG_API_ID || '', 10);
const apiHash = process.env.TG_API_HASH;
const stringSession = new StringSession(process.env.TG_STRING_SESSION);
const BOT_TOKEN: string = process.env.BOT_TOKEN || "";

async function sendFileToTelegram(
    filePath: string,
    fileName: string,
    chatId: string,
    onProgressCallback: (progress: number) => void
): Promise<void> {
    try {
        const { TelegramClient } = require("telegram");
        const client = new TelegramClient(stringSession, apiId, apiHash, {
            connectionRetries: 5,
        });

        await client.start({
            phoneNumber: async () => await input.text("Please enter your number: "),
            password: async () => await input.text("Please enter your password: "),
            phoneCode: async () =>
                await input.text("Please enter the code you received: "),
            onError: (err: any) => console.log(err),
        });

        const message = await client.sendFile(
            chatId,
            { file: filePath },
            {
                onUploadProgress: (progressEvent: any) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );

                    console.log(progress);
                    onProgressCallback(progress);
                },
            }
        );

        console.log("Video uploaded to Telegram successfully");

        fs.unlinkSync(filePath);
    } catch (error) {
        console.error("Error uploading file to Telegram:", error);
        throw error;
    }
}

export { sendFileToTelegram };
