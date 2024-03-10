"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import MessageButton from "@/components/atoms/MessageButton";
import CommentCard from "@/components/molecules/CommentCard";
import SamplePromptsCard from "@/components/molecules/SamplePromptsCard";
import Nav from "@/components/organisms/Nav";
import { useGlobalContext } from "@/contexts/authContext";
import { listUserDocs } from "@/utils/api";
import { useChatHook } from "@/hooks/useChat";
import { isEmpty } from "@/utils";

const samplePrompts = [
  "Do you have an idea of the size of a bag of rice?",
  "List five condiments I can use to prepare Jollof rice",
];

const explorer = () => {
  const { user } = useGlobalContext();

  const [bodyText, setBodyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [responsePair, setResponsePair] = useState<any>([]);

  const { tempPairs, value, responding, setValue, askQuestion } =
    useChatHook(responsePair);

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
    <div className="flex flex-col gap-8">
      <Nav />

      <div className="flex">
        <div className="flex-1 flex flex-col gap-4 items-center px-8 pb-60">
          {isEmpty(tempPairs) ? (
            <div className="flex flex-col gap-8 items-center">
              <p className="max-w-prose text-balance text-center">
                I can help you plan menus, list condiments, for your menus,
                create meal plans and manage your budget
              </p>
              <div className="flex gap-4">
                {samplePrompts.map((body) => (
                  <SamplePromptsCard title={"Chat"} body={body} />
                ))}
              </div>
            </div>
          ) : (
            tempPairs.map((pair: any, index: number) => {
              return (
                <>
                  <ChatBubble name="You" message={pair.human_message} />
                  {pair.ai_message ? (
                    <ChatBubble name="High feast" message={pair.ai_message} />
                  ) : (
                    <div>loading</div>
                  )}
                </>
              );
            })
          )}

          <div className=" flex flex-col justify-end gap-4 bg-white p-4 fixed bottom-4 max-w-[48.5rem] w-full h-min rounded-[20px] shadow-[0_0_50px_7px_rgba(0,0,0,0.08)]">
            <div className="w-full bg-white p-4 rounded shadow-[0_0_50px_7px_rgba(0,0,0,0.08)]">
              {/* This enables the textarea to auto grow! */}
              <div className="relative">
                <div className="whitespace-pre-line invisible min-h-[4rem] w-full">
                  {bodyText}
                </div>
                <textarea
                  className="absolute inset-0 w-full overflow-y-hidden border-none focus:outline-none text-[#4C505F] h-[4.5rem] resize-none h-[initial]"
                  placeholder="Enter an idea proposal..."
                  onChange={(e) => setBodyText(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <MessageButton
                onClick={async () => {
                  alert("yeah");
                }}
              />
            </div>
          </div>
        </div>
        {/* <div>hello</div> */}
      </div>
    </div>
  );
};

const ChatBubble = (chat: { name: string; message: string; time?: string }) => {
  return (
    <div className=" flex w-full gap-2 pr-6 max-w-[48.5rem]">
      <div className=" w-full max-w-[70px] h-[70px] overflow-hidden rounded-full relative">
        <Image
          src={"/logo.svg"}
          style={{
            objectFit: "cover",
            zIndex: -1,
            background: "white",
          }}
          fill
          priority
          alt={`something`}
        />
      </div>
      <CommentCard name={chat.name} message={chat.message} />
    </div>
  );
};

export default explorer;
