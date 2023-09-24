import { Badges } from "./twitch_data";

export interface Deferred<T> extends Promise<T> {
  resolve: (value?: T | PromiseLike<T>) => void;
}
export function deferred<T>(): Deferred<T> {
  let methods;
  const promise = new Promise<T>((resolve, reject): void => {
    methods = { resolve, reject };
  });
  return Object.assign(promise, methods) as Deferred<T>;
}
export function getChannelName(channel: string) {
  channel = channel.toLowerCase();
  if (channel[0] !== "#") channel = "#" + channel;
  return channel;
}

export function removeBreaks(s: string) {
  return s.replace(/(\r\n|\n|\r)/gm, "");
}

export function findChannelName(str: string) {
  let chan = "";
  for (const char of str) {
    if (char === ":") break;
    chan += char;
  }
  return chan;
}
interface MySignal<T> {
  signal: Deferred<T>;
}
export async function* getAsyncIter<T>(o: MySignal<T>) {
  while (true) {
    try {
      const data = await o.signal;
      yield data;
      o.signal = deferred();
    } catch (_) {
      break;
    }
  }
}
export const createBadgeObj = (): Badges => ({
  subscriber: false,
  glitchcon: false,
  turbo: false,
  moderator: false,
});
export function setBadges(badges: string, badgeRec: Badges) {
  const reg = /^[a-z]+$/i;
  let badge = "";

  for (const char of badges) {
    const test = reg.test(char);
    if (test) {
      badge += char;
    } else {
      if (badge.length) {
        //@ts-ignore
        badgeRec[badge] = true;
      }
      badge = "";
    }
  }
}
