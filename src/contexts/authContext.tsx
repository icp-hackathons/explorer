import { User, authSubscribe, initJuno } from "@junobuild/core-peer";
import cookies from "js-cookie";
import { useRouter } from "next/router.js";
import { createContext, useContext, useEffect, useState } from "react";
// import { User, authSubscribe } from '@junobuild/core';

export interface AuthContext {
  mapUserData: (user: User) => Promise<any>;
  user: User | null;
  setUserCookie: (user: User | null) => void;
  getUserFromCookie: () => any;
  setSubmitting: (submitting: boolean) => void;
}

export const GlobalContext = createContext<AuthContext | undefined>(undefined);

export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

const GlobalProvider = ({ children }: any) => {
  const [user, setUser] = useState<any | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();

  const getUserFromCookie = () => {
    const cookie = cookies.get("auth");
    if (!cookie) {
      return;
    }
    return cookie;
  };

  const setUserCookie = (user: User | null) => {
    if (!user) {
      return;
    }
    cookies.set("auth", String(user), {
      expires: 1 / 24,
    });
  };

  const mapUserData = async (user: User) => {
    const { key, owner, created_at } = user;
    return { key, owner, created_at };
  };

  const removeUserCookie = () => cookies.remove("auth");

  useEffect(() => {
    (async () => {
      try {
        await initJuno({
          satelliteId: "k2y4c-mqaaa-aaaal-adyqq-cai",
        });
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  //Unscribe from Authlistner
  useEffect(() => {
    const cancelAuthListener = authSubscribe((user: User | null) => {
      console.log("User:", user);
      if (user) {
        setUserCookie(user);
        console.log(user);
        setUser(user);
      } else {
        // setUserCookie(null)
        // router.push("/login")
      }
    });
    const userFromCookie: any = getUserFromCookie();
    if (!userFromCookie) {
      return;
    }

    console.log("user cookieee", userFromCookie);
    if (user) {
      cancelAuthListener();
    }
    // setUser(userFrom .Cookie);
  }, []);

  // Listen to UnAuthStateChange
  // useEffect(() => {
  //     authSubscribe((user: User | null) => {
  //         if (!user) {
  //             router.push("/login")
  //         }

  //     });
  // },);

  return (
    <GlobalContext.Provider
      value={{
        mapUserData,
        user,
        setUserCookie,
        getUserFromCookie,
        setSubmitting,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
