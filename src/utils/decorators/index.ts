import { IListener } from "../../managers/ListenerManager";
import { BotClient } from "../../structures/BotClient";

export * from "./PropertyModifier";

export function DiscordEvent(name: IListener["name"]): any {
    return function decorate<T extends IListener>(target: new (...args: any[]) => T): new (client: BotClient) => T {
        return new Proxy(target, {
            construct: (ctx, [client]): T => new ctx(client, name)
        });
    };
}
