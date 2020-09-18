import { UserResolvable } from "discord.js";

export const defaultPrefix = "$";
export const devs: UserResolvable[] = ["290159952784392202"];
export const production = process.env.NODE_ENV === "production";

export default { defaultPrefix, devs };
