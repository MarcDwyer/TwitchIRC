import { createContext, useContext, useMemo } from "react";
import { UseFollowers, useFollowers } from "../hooks/useFollowers";
import { useTwitchChat } from "../hooks/useTwitchChat";
import { UseJoined, useJoined } from "../hooks/useJoined";
import { useChatAPI } from "../hooks/useChatAPI";
import { HelixAPI } from "../../../helix";
import { useNavigate } from "react-router-dom";
import { CLIENTID } from "../../../utils/oauth";

export type TwitchState = {
  followers: UseFollowers;
  token: string;
  joined: UseJoined;
  loginName: string;
};
//@ts-ignore
const TwitchCtx = createContext<TwitchState>();

type TwitchProviderParams = {
  children: React.ReactNode;
  token: string;
  loginName: string;
};
export const TwitchProvider = ({
  children,
  token,
  loginName,
}: TwitchProviderParams) => {
  const navigate = useNavigate();

  const helixAPI = useMemo(
    () =>
      new HelixAPI(
        { token: token ?? "", loginName, clientId: CLIENTID },
        navigate
      ),
    [token, loginName, navigate]
  );

  const chatAPI = useChatAPI({
    token,
    loginName,
  });

  const twitchChat = useTwitchChat(chatAPI);

  const joined = useJoined(chatAPI);

  const followers = useFollowers({ joined, helixAPI, twitchChat });

  return (
    <TwitchCtx.Provider value={{ token, followers, joined, loginName }}>
      {children}
    </TwitchCtx.Provider>
  );
};

export const useTwitch = () => {
  return useContext(TwitchCtx);
};
