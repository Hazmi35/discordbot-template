import { ClientOptions, ClientPresenceStatus, UserResolvable } from "discord.js";

export const defaultPrefix = "$";
export const devs: UserResolvable[] = ["290159952784392202"];
export const clientOptions: ClientOptions = {
    disableMentions: "everyone",
    messageCacheLifetime: 1800,
    messageCacheMaxSize: Infinity,
    messageSweepInterval: 300,
    restRequestTimeout: 60000
};
export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;
export const prefix = isDev ? "d$" : "$";
export const presenceData = {
    activities: [
        "Hello, World!",
        "Watching {textChannels.size} of text channels in {guilds.size}",
        "Listening to {users.size} of users",
        "Hello there! I am {username}",
        `My default prefix is ${prefix}`
    ],
    status: ["online"] as ClientPresenceStatus[],
    interval: 60000
};

export default { clientOptions, defaultPrefix, devs, isDev, isProd, prefix, presenceData };
