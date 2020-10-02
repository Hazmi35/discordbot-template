import { resolve } from "path";
import { BotClient } from "./structures/BotClient";
import { clientOptions } from "./config";

const client = new BotClient(clientOptions);

client.listeners.loadDirectory(resolve(__dirname, "listeners")).catch(e => client.logger.error("LISTENER_LOAD_ATTEMPT:", e));

client.login(process.env.DISCORD_TOKEN)
    .catch(e => client.logger.error("CLIENT_LOGIN_ERR:", e));
