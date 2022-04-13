import { writable } from 'svelte/store';
import abi from "./utils/DDiscord.json";

export const account = writable(null);
export const contract = writable(null);
export const channels = writable([]);
export const currentChannel = writable(0);
export const messages = writable([]);

export const contractAddress = "0xD4f7dA2359a51483828bD0e2E7D635D9baE0B8e9";
export const contractABI = abi.abi;