import { useChatHook } from "@/hooks/useChat";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatBubble = ({
  text,
  isHighfeast,
  isLoading = false,
}: {
  text: any;
  isHighfeast: boolean;
  isLoading: boolean;
}) => {
  return (
    <div>
      <div>
        <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>
      </div>
    </div>
  );
};

const ChatLayout = ({
  history,
}: {
  history: { question: string; answer: string }[];
}) => {
  const { tempPairs, value, responding, setValue, askQuestion } =
    useChatHook(history);

  return (
    <div>
      <div>
        {tempPairs &&
          tempPairs.map((pair: any, index: number) => (
            <div>
              <ChatBubble
                text={pair.human_message}
                isHighfeast={false}
                isLoading={false}
              />
              {pair.ai_message ? (
                <ChatBubble
                  text={pair.ai_message}
                  isHighfeast={true}
                  isLoading={false}
                />
              ) : (
                <ChatBubble text={""} isHighfeast={true} isLoading={true} />
              )}
            </div>
          ))}

        <div>
          <input />
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default ChatLayout;
