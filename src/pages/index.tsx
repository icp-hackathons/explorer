import ChatBubble from "@/components/chatBubble";
import LoginButton from "@/components/signIn";
import { useGlobalContext } from "@/contexts/authContext";
import { listUserDocs } from "@/utils/api";
import { LogoCrown } from "@/utils/logoCrown";
import Head from "next/head";
import { useEffect, useState } from "react";

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
        <div>
          {!responsePair && (
            <div>
              <LogoCrown />
              <p>Your food companion for every occasion...</p>
              {!user && (
                <>
                  <LoginButton />
                </>
              )}
            </div>
          )}

          {responsePair && <ChatBubble history={responsePair} />}
        </div>
      </main>
    </>
  );
}
