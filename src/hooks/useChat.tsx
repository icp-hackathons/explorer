import { insertPromptResponse } from "@/utils/api";
import { useEffect, useState } from "react";

export const useChatHook = (initialHistory: any) => {
  const [tempPairs, setTempPairs] = useState<any>([]);
  const [value, setValue] = useState("");
  const [response, setResponse] = useState(null);
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    console.log("Preloading history:", initialHistory);
    if (initialHistory) {
      setTempPairs([...initialHistory]);
    }
  }, [initialHistory]);

  const askQuestion = async () => {
    setTempPairs([...tempPairs, { human_message: value, ai_message: null }]);

    setTimeout(() => {
      setResponding(true);
    }, 1000);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [...tempPairs, value], prompt: value }),
    });
    setValue("");
    const data = await response.json();

    if (data && data.message) {
      const msg = data.message.startsWith("AI: ")
        ? data.message.substring(4).trim()
        : data.message.substring(4).trim();
      setResponse(msg);
    }
  };

  const updateJunoStore = async (
    id: string,
    question: string,
    response: string
  ) => {
    // //replace undefined with actual user's id
    TODO: await insertPromptResponse("undefined", question, response);
  };

  useEffect(() => {
    if (response) {
      const updatedPairs = [...tempPairs];
      updatedPairs[tempPairs.length - 1].ai_message = response;
      setTempPairs(updatedPairs);
      setResponding(false);
      setResponse(null);
      updateJunoStore(
        "",
        updatedPairs[tempPairs.length - 1].human_message,
        response
      );
    }
  }, [response, tempPairs]);

  return { tempPairs, value, responding, setValue, askQuestion };
};
