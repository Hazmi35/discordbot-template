import config from "../config";
import { Client, ClientOptions } from "discord.js";
import got from "got";

export class BotClient extends Client {
    public readonly config = config;
    public readonly httpClient = got;
    public constructor(options?: ClientOptions) { super(options); }
}
