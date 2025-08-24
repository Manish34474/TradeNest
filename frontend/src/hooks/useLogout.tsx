import axios from "@/api/axios";
import useAuth from "./useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const initialAuthState = {
  id: null,
  email: null,
  username: null,
  accessToken: null,
  roles: [],
};

const useLogout = () => {
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    setAuth(() => initialAuthState);

    try {
      await axios.get("/auth/logout", {
        withCredentials: true,
      });
      navigate("/");
    } catch (err) {
      toast.error("Oops!!! Something went wrong. Try again");
    }
  };

  return logout;
};

export default useLogout;
