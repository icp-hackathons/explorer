import { Box, Text, Flex, VStack, Avatar, Textarea } from "@chakra-ui/react";
import React from "react";
import { AiFillRobot, AiOutlineEllipsis } from "react-icons/ai";
import { BsFillSendFill } from "react-icons/bs";
import remarkGfm from 'remark-gfm';
import Markdown from "react-markdown";
import { useChatHook } from "@/hooks/useChat";



const ChatBubble = ({ text, isHighfeast, isLoading = false }: { text: any, isHighfeast: boolean, isLoading: boolean }) => {
    return (
        <Flex
            direction={isHighfeast ? "row-reverse" : "row"}
            align="center"
            mb={2}
            width={"100%"}
        >
            <Avatar
                name={isHighfeast ? "Highfeast" : "You"}
                size="sm"
                bg={isHighfeast ? "#004338" : "#ffc66f"}
                mr={isHighfeast ? 0 : 2}
                ml={isHighfeast ? 2 : 0}
            />
            <Box
                bg={isHighfeast ? "green.50" : "whiteAlpha.900"}
                color={isHighfeast ? "#004338" : "black"}
                borderRadius="lg"
                fontWeight={"semibold"}
                py={2}
                px={4}
                maxWidth="70%"
                fontSize={"sm"}
            >
                <Markdown remarkPlugins={[remarkGfm]}>{text}</Markdown>

                {isLoading && (
                    <>
                        <AiOutlineEllipsis />
                    </>
                )}
            </Box>
            {isHighfeast && !isLoading && <AiFillRobot size={20} color="blue.500" />}
        </Flex>
    );
};

const ChatLayout = ({ history }: { history: { question: string, answer: string }[] }) => {

    const { tempPairs, value, responding, setValue, askQuestion } = useChatHook(history);

    return (
        <Box mt={12} w="100%" p={4} h="90vh">
            <VStack
                bg="gray.50"
                bottom={0}
                p={2}
                borderRadius={"8px"}
                mb={32}
                pb={32}
            >

                {tempPairs && tempPairs.map((pair: any, index: number) => (
                    <Box key={index} w="100%">
                        <ChatBubble text={pair.human_message} isHighfeast={false} isLoading={false} />
                        {pair.ai_message ? (
                            <ChatBubble text={pair.ai_message} isHighfeast={true} isLoading={false} />
                        ) : (
                            <ChatBubble text={""} isHighfeast={true} isLoading={true} />
                        )}
                    </Box>
                ))}


                <Flex
                    position={"fixed"}
                    bottom={0}
                    w="100%"
                    alignItems={"flex-start"}
                >

                    <Textarea
                        ml={2}
                        mb={1}
                        isDisabled={responding}
                        h="80px"
                        flex="1"
                        value={!responding ? value : ""}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="Ask me anything..."
                    />

                    <Box
                        w="40px"
                        as="button"
                        onClick={() => askQuestion()}
                        color="#004338"
                        boxShadow={"lg"}>
                        <BsFillSendFill size={"24px"} />
                    </Box>

                </Flex>
            </VStack>
        </Box>
    );
};

export default ChatLayout;
