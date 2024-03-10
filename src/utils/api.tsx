
import { type Doc,  setDoc, listDocs } from "@junobuild/core-peer";



export async function callVectorDBQAChain(query: string,
    index: any,
    namespace: string,
    messages: any[] | any) {

    const requestBody = {
        query: query,
        index: index,
        namespace: namespace,
        messages: messages,
    };

    try {
        const url = 'http://localhost:3000/api/vector-search';
        const vectorSearchResponse = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!vectorSearchResponse.ok) {
            throw new Error('Failed to fetch from vector-search');
        }

        const result = await vectorSearchResponse.json();
        return result

    } catch (error) {
        console.error(error);

    }
}

export const insertPromptResponse = async (userID: string, humanMessage: string, aiMessage: string) => {
    const doc = await setDoc({
        collection: "demo",
        doc: {
            key: `${userID}-${new Date().getTime()}`,
            data: {
                human_message: humanMessage,
                ai_message: aiMessage,
            }
        },
    });
    return doc;
};

//conversation history
export const listUserDocs = async (userID: string): Promise<any> => {
    try {
        const responsePairs: any = [];
        const myList: any = await listDocs({
            collection: "demo",
            filter: {
                order: {
                    desc: false,
                    field: "updated_at"
                },
            }
        }).then((x) => {
            return x.items.filter((item) => item.key.startsWith(`${userID}-`));
        });

        myList.forEach((doc: Doc<any>) => {
            const { human_message, ai_message } = doc.data;
            responsePairs.push({ human_message, ai_message });
        });

        return responsePairs;
    } catch (error) {
        console.error("Error listing user docs:", error);
        return [];
    }
};