import { useEffect, useState } from "react";
import { getParamsFromHash } from "../../utils/oauth";
import { useNavigate } from "react-router-dom";

export type AuthParameters = {
  access_token?: string;
  scope: string;
  token_type: string;
};
export default function Auth() {
  const [token, setToken] = useState<string | null>(null);
  const [loginName, setLoginName] = useState<string>("");
  const navigate = useNavigate();

  useEffect(() => {
    const { access_token } = getParamsFromHash<AuthParameters>(
      document.location.hash
    );
    if (access_token) {
      setToken(access_token);
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <form
      className="m-auto flex flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        if (token && loginName.length) {
          navigate(
            `/trollerino/?access_token=${token}&loginName=${loginName}`,
            { state: { token, loginName } }
          );
        }
      }}
    >
      {token && (
        <>
          <label className="mb-1">Whats your Twitch login name?</label>
          <input
            className="text-white rounded p-1 bg-gray-700"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
          />
        </>
      )}
    </form>
  );
}
