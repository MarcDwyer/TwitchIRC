import { useRecoilState, useRecoilValue } from "recoil";
import { helixState } from "../selectors/helixAPI";
import { followersState } from "../atoms/followers";
import { useCallback, useEffect } from "react";

export const useFollowers = () => {
  const helixAPI = useRecoilValue(helixState);
  const [followers, setFollowers] = useRecoilState(followersState);

  const getFollowers = useCallback(async () => {
    try {
      if (!helixAPI) {
        throw "HelixAPI not yet set";
      }
      const [followersData] = await helixAPI.getLiveFollowers();
      setFollowers(followersData.data);
    } catch (e) {
      console.error(e);
    }
  }, [setFollowers, helixAPI]);

  useEffect(() => {
    if (helixAPI && !followers) {
      getFollowers();
    }
  }, [getFollowers]);

  return {
    getFollowers,
    followers,
  };
};
