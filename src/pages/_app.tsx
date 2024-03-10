import GlobalProvider from "@/contexts/authContext";
import { useSignInOnItemClick } from "@/hooks/useSignInOnItemClick";
import "@/styles/globals.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  useSignInOnItemClick();

  return (
    <>
      <GlobalProvider>
        <Component {...pageProps} />
      </GlobalProvider>
    </>
  );
}
