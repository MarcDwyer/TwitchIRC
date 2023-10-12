import { useEffect, useMemo } from "react";
import { useJoined } from "./useJoined";
import { useRecoilState } from "recoil";
import { activeChannelNameState } from "../atoms/activeChannelName";

export const useActiveChannel = () => {
  const [activeChannelName, setActiveChannelName] = useRecoilState(
    activeChannelNameState
  );

  const { joined } = useJoined();

  const activeChannel = useMemo(() => {
    if (!activeChannelName) {
      return null;
    }
    return joined.get(activeChannelName);
  }, [activeChannelName, joined]);

  useEffect(() => {
    if (!activeChannel && joined.size) {
      const { channelName } = Array.from(joined.values())[0];
      setActiveChannelName(channelName);
    }
  }, [activeChannel, joined]);

  return {
    setActiveChannelName,
    activeChannel,
  };
};
