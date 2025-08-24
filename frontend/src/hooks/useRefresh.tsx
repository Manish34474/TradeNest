import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";

const REFRESH_URL = "/auth/refresh";

const useRefresh = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get(REFRESH_URL, {
      withCredentials: true,
    });
    setAuth((prev) => {
      return {
        ...prev,
        id: response.data.id,
        email: response.data.email,
        username: response.data.username,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });
    return response.data.accessToken;
  };

  return refresh;
};

export default useRefresh;
