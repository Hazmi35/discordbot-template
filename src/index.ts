import { BotClient } from "./structures/BotClient";

const client = new BotClient();

client.login("token")
    .catch(console.error);
