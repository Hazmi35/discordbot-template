import config from "../config";
import { Client, ClientOptions } from "discord.js";
import got from "got";
import { createLogger } from "../utils/Logger";
import { ListenerManager } from "../managers/ListenerManagers";

export class BotClient extends Client {
    public readonly config = config;
    public readonly httpClient = got;
    public readonly logger = createLogger(this.config.isProd);
    // @ts-expect-error override
    public listeners: ListenerManager;
    public constructor(options?: ClientOptions) {
        super(options);
        this.listeners = new ListenerManager(this);
    }
}
