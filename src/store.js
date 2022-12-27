import { writable } from 'svelte/store';

export const currentPack = writable('0');

export const currentPackList = writable([]);

export const overlayOpen = writable(false);
