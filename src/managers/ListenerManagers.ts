import type { ClientEvents } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import { promises as fs } from "fs";
import { resolve } from "path";
import { lastIndex } from "../utils/Arrays";

export class ListenerManager {
    public constructor(public client: BotClient) {}

    public add(listener: IListener): IListener {
        this.client.logger.info(`Listener for event "${listener.name!.toString()}" is added & registered`);
        this.client.addListener(listener.name!, (...args) => listener.execute(...args));
        return listener;
    }

    public remove(listener: IListener): boolean {
        this.client.logger.info(`Listener for event "${listener.name!.toString()} is removed`);
        this.client.removeListener(listener.name!, (...args) => listener.execute(...args));
        return true;
    }

    public async load(path: string): Promise<IListener | any> {
        if (!(await fs.stat(path)).isFile()) return this.client.logger.error("LOAD_LISTENER_WRONG_PATH:", new Error("Specified path is not a file"));
        const fileName = lastIndex(path.split("/")).split(".")[0];
        const listener = new (await import(path))[fileName](this.client);
        if (listener === undefined) return this.client.logger.error("LOAD_LISTENER_FILE_NOT_VALID:", new Error(`File ${fileName} is not a valid listener.`));
        return this.add(listener);
    }

    public async loadDirectory(path: string): Promise<IListener[] | any> {
        if (!(await fs.stat(path)).isDirectory()) return this.client.logger.error("LOAD_LISTENER_WRONG_PATH:", new Error("Specified path is not a directory"));
        const files = await fs.readdir(path);
        const listeners = [];
        for (const file of files) {
            const fileName = file.split(".")[0];
            const listener = new (await import(resolve(path, file)))[fileName](this.client);
            if (listener === undefined) return this.client.logger.error("LOAD_LISTENER_FILE_NOT_VALID:", new Error(`File ${fileName} is not a valid listener.`));
            listeners.push(this.add(listener));
        }
        return listeners;
    }
}

export interface IListener {
    name?: keyof ClientEvents;
    execute(...args: any): any;
}
