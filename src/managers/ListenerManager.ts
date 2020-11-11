import { ClientEvents } from "discord.js";
import { BotClient } from "../structures/BotClient";
import { promises as fs } from "fs";
import { resolve, parse } from "path";

export class ListenerManager {
    public constructor(public client: BotClient) {}

    public add(listener: IListener): IListener {
        this.client.logger.info(`Listener for event "${listener.name.toString()}" is added & registered`);
        this.client.addListener(listener.name, (...args) => listener.execute(...args));
        return listener;
    }

    public remove(listener: IListener): boolean {
        this.client.logger.info(`Listener for event "${listener.name.toString()} is removed`);
        this.client.removeListener(listener.name, (...args) => listener.execute(...args));
        return true;
    }

    public async load(path: string): Promise<IListener | any> {
        const resolvedPath = resolve(path);
        if (!(await fs.stat(resolvedPath)).isFile()) return this.client.logger.error("LOAD_LISTENER_NOT_A_FILE:", new Error("Target path is not a file"));
        const listener = await this.import(resolvedPath, this.client);
        if (listener === undefined) return this.client.logger.error("LOAD_LISTENER_FILE_NOT_VALID:", new Error(`File ${parse(resolvedPath).name} is not a valid listener.`));
        listener.path = resolvedPath;
        return this.add(listener);
    }

    public async loadDirectory(path: string): Promise<IListener[] | any> {
        const resolvedPath = resolve(path);
        if (!(await fs.stat(resolvedPath)).isDirectory()) return this.client.logger.error("LOAD_LISTENER_NOT_A_DIR:", new Error("Target path is not a directory"));
        const files = await fs.readdir(resolvedPath);
        const listeners = [];
        for (const file of files) { listeners.push(await this.load(resolve(resolvedPath, file))); }
        return listeners;
    }

    private async import(path: string, ...args: any[]): Promise<IListener | undefined> {
        const file = (await import(path))[parse(path).name];
        return file ? new file(...args) : undefined;
    }
}

export interface IListener {
    name: keyof ClientEvents;
    path?: string;
    execute(...args: any): any;
}
