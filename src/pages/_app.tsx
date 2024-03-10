import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ChakraProvider } from '@chakra-ui/react'
import GlobalProvider from "@/contexts/authContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider resetCSS={true}>
      <GlobalProvider>
      <Component {...pageProps} />
      </GlobalProvider>
    </ChakraProvider>
  );
}
