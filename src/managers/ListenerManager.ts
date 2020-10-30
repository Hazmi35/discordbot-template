import type { ClientEvents } from "discord.js";
import type { BotClient } from "../structures/BotClient";
import { promises as fs } from "fs";
import { resolve } from "path";
import { lastIndex } from "../utils/Arrays";

export class ListenerManager {
    public constructor(public client: BotClient) {}

    public add(listener: IListener): IListener {
        this.client.logger.info(`Listener for event "${listener.name?.toString() as string}" is added & registered`);
        this.client.addListener(listener.name!, (...args) => listener.execute(...args));
        return listener;
    }

    public remove(listener: IListener): boolean {
        this.client.logger.info(`Listener for event "${listener.name?.toString() as string} is removed`);
        this.client.removeListener(listener.name!, (...args) => listener.execute(...args));
        return true;
    }

    public async load(path: string): Promise<IListener | any> {
        const resolvedPath = resolve(path);
        if (!(await fs.stat(resolvedPath)).isFile()) return this.client.logger.error("LOAD_LISTENER_NOT_A_FILE:", new Error("Specified path is not a file"));
        const fileName = lastIndex(resolvedPath.split("/")).split(".")[0];
        const listener = new (await import(resolvedPath))[fileName](this.client);
        if (listener === undefined) return this.client.logger.error("LOAD_LISTENER_FILE_NOT_VALID:", new Error(`File ${fileName} is not a valid listener.`));
        return this.add(listener);
    }

    public async loadDirectory(path: string): Promise<IListener[] | any> {
        const resolvedPath = resolve(path);
        if (!(await fs.stat(resolvedPath)).isDirectory()) return this.client.logger.error("LOAD_LISTENER_NOT_A_DIR:", new Error("Specified path is not a directory"));
        const files = await fs.readdir(resolvedPath);
        const listeners = [];
        for (const file of files) { listeners.push(await this.load(resolve(resolvedPath, file))); }
        return listeners;
    }
}

export interface IListener {
    name?: keyof ClientEvents;
    execute(...args: any): any;
}
