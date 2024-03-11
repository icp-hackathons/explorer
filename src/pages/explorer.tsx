"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

import MessageButton from "@/components/atoms/MessageButton";
import CommentCard from "@/components/molecules/CommentCard";
import SamplePromptsCard from "@/components/molecules/SamplePromptsCard";
import Nav from "@/components/organisms/Nav";
import { useGlobalContext } from "@/contexts/authContext";
import { useChatHook } from "@/hooks/useChat";
import { isEmpty } from "@/utils";
import { listUserDocs } from "@/utils/api";
import TextareaAutosize from 'react-textarea-autosize';
import { BiSend } from 'react-icons/bi';
// import { deleteManyDocs } from "@junobuild/core";
import { deleteDoc, listDocs, deleteManyDocs } from "@junobuild/core-peer";
import { useRouter } from "next/router";

const samplePrompts = [
  "Do you have an idea of the size of a bag of rice?",
  "List five condiments I can use to prepare Jollof rice",
];

const explorer = () => {
  const { user } = useGlobalContext();

  const [bodyText, setBodyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [responsePair, setResponsePair] = useState<any>([]);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  const { tempPairs, value, responding, setValue, askQuestion } =
    useChatHook(responsePair);

  useEffect(() => {
    // Load chat History from Juno when the component mounts
    const loadResponsePair = async () => {
      setLoading(true);
      const responsePairs = await listUserDocs(user?.owner || "");
      if (responsePairs && responsePairs.length > 0) {
        setResponsePair(responsePairs);
      }
      setLoading(false);
    };
    if (user) {
      loadResponsePair();
    }
  }, [user]);

  return (
    <div className="flex flex-col gap-8 w-full">
      <Nav />



      <div className="flex">
        <div className="flex-1 flex flex-col gap-4 items-center px-8 pb-60 ">
          {isEmpty(tempPairs) ? (
            <div className="flex flex-col gap-8 items-center mt-24 max-w-[48.5rem]">
              <p className="max-w-prose text-balance text-center font-bellota text-2xl font-bold text-[#194237]">
                I can help plan your menus, list out recipes and condiments, <br /> and review your food budget
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {samplePrompts.map((body, i) => (
                  <div key={i}
                    style={{
                      cursor: "pointer"
                    }}
                  >
                    <SamplePromptsCard title={"Chat"} body={body} />
                  </div>
                ))}
              </div>
            </div>
          ) :

            (
              tempPairs.map((pair: any, index: number) => {
                return (
                  <div className={"flex w-full my-8 gap-8  max-w-[48.5rem] flex-col"} key={index}>
                    <ChatBubble name="You" message={pair.human_message} isUser />
                    {pair.ai_message ? (
                      <ChatBubble name="High feast" message={pair.ai_message} />
                    ) : (
                      // <div>loading</div>
                      <ChatBubble name="High feast" message={undefined} />
                    )}
                  </div>
                );
              })
            )


          }

          <div className=" flex flex-col justify-end gap-4 bg-white p-4 fixed bottom-4 max-w-[48.5rem] w-full h-min rounded-[20px] shadow-[0_0_50px_7px_rgba(0,0,0,0.08)]">
            <div className="w-full bg-white p-3 rounded shadow-[0_0_50px_7px_rgba(0,0,0,0.08)]">


              <div className="relative">

                {/* <div className="whitespace-pre-line invisible max-h-400px w-full">
                  {bodyText}
                </div> */}



                {/* <textarea
                  className="absolute inset-0 w-full overflow-y-hidden border-none focus:outline-none text-[#4C505F] h-[4.5rem] max-h-[calc(1.5em * 3)] resize-none h-auto"
                  placeholder="Ask me anything..."
                  style={{ maxHeight: "200px" }}
                  value={value}
                  onChange={(e) => {
                    setBodyText(e.target.value);
                    setValue(e.target.value);
                  }}
                /> */}

                <TextareaAutosize
                  maxRows={4}

                  style={{
                    background: "transparent",
                    width: "100%",
                    outline: "none"
                  }}
                  placeholder="Ask me anything..."
                  value={value}
                  onChange={(e) => {
                    setBodyText(e.target.value);
                    setValue(e.target.value);
                  }}
                />
              </div>
            </div>

            <div className="flex justify-between align-center">
              {/* <MessageButton
                onClick={() => {
                  const confirmed = window.confirm("Start new Chat. Chat History would be lost");
                  if (confirmed) {
                    // Proceed with starting a new chat (clear chat history, etc.)
                  } else {
                    // User canceled the action
                  }
                }}
              /> */}

              <p
                onClick={async () => {
                  setDeleting(true)


                  await listDocs({
                    collection: "demo",

                  }).then(async (x: any) => {

                    console.log("founded", x);
                    let xx = [];
                    for (let i = 0; i < x.items.length; i++) {
                      if (x) {
                        if (x.items[i].key.startsWith(`${user?.owner}-`)) {
                          console.log("items", x)
                          await deleteDoc({
                            collection: "demo",
                            doc: x.items[i]
                          });
                          // console.log("deleted")
                        }
                      }
                    }
                    router.reload()
                    setDeleting(false)
                  });

                }}
                className="mt-2"
                style={{
                  color: "blue",
                  textDecoration: "underline",
                  cursor: "pointer",
                  fontSize: "small"
                }}
              >Clear Chat history</p>
              <div>
              </div>

              <div
                className="h-min bg-[green] px-[18px] py-3 rounded-3xl text-white grid place-items-center cursor-pointer"
                onClick={() => {
                  setBodyText("");
                  askQuestion();
                }}
              >
                <BiSend
                  onClick={() => {
                    setBodyText("");
                    askQuestion();
                  }}
                  color="white"
                  size={32}
                />
              </div>

            </div>
          </div>
        </div>

      </div>

      {deleting && (

        <LoadingScreen />


      )}
    </div>
  );
};

const ChatBubble = (chat: {
  name: string;
  message: string | undefined;
  isUser?: boolean;
}) => {
  return (
    <div className=" flex w-full gap-2 pr-5 ">
      <div className="w-12 h-12 p-6  max-w-[70px] max-h-[70px]  overflow-hidden rounded-full relative">


        <Image
          src={chat.isUser ? "/crown.svg" : "/crown.svg"}
          style={{
            objectFit: "cover",
            zIndex: -1,
            background: "white",
            // backgroundImage: `url(${!chat.isUser ? "/crown.svg" : "/crown.svg"})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: '80%',
            backgroundPosition: 'center center',
            backgroundColor: 'white',
            filter: !chat.isUser ? 'none' : 'grayscale(100%)',
          }}
          fill
          // layout="fill"
          priority
          alt={`something`}
        />

      </div>

      <CommentCard
        name={chat.name}
        message={chat.message}
        isUser={chat.isUser}
      />
    </div >
  );
};

const LoadingScreen = () => {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
        color: "yellow"
      }}
    >
      <div>
        <p>Deleting Chats to bin...</p>
      </div>
    </div>
  );
};

export default explorer;
