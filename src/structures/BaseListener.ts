import { IListener } from "../managers/ListenerManager";
import { BotClient } from "./BotClient";

export class BaseListener {
    public constructor(public client: BotClient, public name: IListener["name"]) {}

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public execute(...args: any): any {}
}
