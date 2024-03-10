import Head from "next/head";
import { Inter } from "next/font/google";
import { Box, Text } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { LogoCrown } from "@/utils/logoCrown";
import { listUserDocs } from "@/utils/api";
import { useGlobalContext } from "@/contexts/authContext";
import ChatBubble from "@/components/chatBubble";
import LoginButton from "@/components/signIn";



export default function Home() {

  const [loading, setLoading] = useState(false);
  const [responsePair, setResponsePair] = useState<any | undefined>(undefined);

  const { user } = useGlobalContext();

  useEffect(() => {
    // Load chat History from Juno when the component mounts
    const loadResponsePair = async () => {
      setLoading(true);
      const responsePairs = await listUserDocs("undefined");
      if (responsePairs && responsePairs.length > 0) {
        console.log("response pair", responsePairs);
        setResponsePair(responsePairs);
      }
      setLoading(false);
    };
    if (user) {
      loadResponsePair();
    }
  }, [user]);



  return (
    <>
      <Head>
        <title>Highfeast Explorer</title>
        <meta name="description" content="Ultimate Food Companion" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Box>

          {!responsePair && (
            <Box w="100%" px={6} py={2}>‰
                <LogoCrown />
              <Text mt={4} textAlign={"center"} fontStyle={"italic"} fontSize={"sm"}>Your food companion for every occasion...</Text>
              {!user && (
                <>
                  <LoginButton />
                </>
              )}
            </Box>
          )}

          {responsePair && <ChatBubble history={responsePair} />}

        </Box>
      </main>
    </>
  );
}
