export const CLIENTID = "9p2h04hvjd9an766oih0w4z150l02y";
export const REDIRECTURI = "http://localhost:3000/auth";

const createOAuthURL = (): string => {
  if (!CLIENTID || !REDIRECTURI) {
    throw new Error("Missing env variable");
  }
  const url = new URL("https://id.twitch.tv/oauth2/authorize");
  url.searchParams.set("client_id", CLIENTID);
  url.searchParams.set("redirect_uri", REDIRECTURI);
  url.searchParams.set("response_type", "token");
  url.searchParams.set("scope", "user:read:follows chat:read chat:edit");
  return url.toString();
};

export const OAuthURL = createOAuthURL();

export function getParamsFromHash<T>(hash: string) {
  hash = hash.slice(1, hash.length - 1);
  hash = "?" + hash;
  const searchParams = new URLSearchParams(hash);

  const params = {} as { [key: string]: any };
  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }
  return params as T;
}
