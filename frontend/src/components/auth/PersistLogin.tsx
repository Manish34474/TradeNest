import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefresh from "@/hooks/useRefresh";
import useAuth from "@/hooks/useAuth";
import { Loading } from "@/components/user/Loading";

const PersistLogin = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const refresh = useRefresh();
  const { auth } = useAuth();

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);
  }, []);

  return (
    <div>
      {isLoading ? (
        <div className="w-screen h-screen overflow-hidden flex justify-center items-center">
          <Loading size="lg" />
        </div>
      ) : (
        <Outlet />
      )}
    </div>
  );
};

export default PersistLogin;
