import Head from "next/head";
import { Box, Text, VStack } from "@chakra-ui/react";
import { type Doc, initJuno, setDoc, authSubscribe, User, signIn, InternetIdentityProvider } from "@junobuild/core-peer";

import { BsFillTriangleFill } from "react-icons/bs"


export default function LoginButton() {

    const _signIn = async () => {
        await signIn({
            provider: new InternetIdentityProvider({
                domain: "ic0.app"
            })
        });
    }

    return (
        <>
            <Box mt={32}>
                <VStack h="100%" alignItems={"center"} justifyContent={"center"}>
                    <BsFillTriangleFill style={{ color: 'orange' }} />
                    <Text as="button" color="blue" textDecoration={"underline"} onClick={_signIn}>Please sign in</Text>

                </VStack>
            </Box>
        </>
    );
}


// 2347268