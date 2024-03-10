import { measuringUnits } from "@/utils/helpers";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { Pinecone } from "@pinecone-database/pinecone";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { OpenAI } from "langchain/llms/openai";
import { NextApiRequest, NextApiResponse } from "next";
import { PineConeMetadata, prompt } from "../../utils/consts";

const pineconeApiKey = process.env.PINECONE_API_KEY;
const openAIApiKey = process.env.OPENAI_API_KEY;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: openAIApiKey,
  });

  const llm = new OpenAI({
    openAIApiKey: openAIApiKey as string,
  });
  const returnedResults = 1;
  const embeddedQuery = await embedQuery(req.body.query, embeddings);

  const docs = await similarityVectorSearch(
    embeddedQuery,
    returnedResults,
    req.body.index,
    req.body.namespace
  );

  const messages = req.body.messages;

  let mappedMessages: any = [];

  messages.forEach((message: any, index: number) => {
    if (messages.length > 1 && index !== messages.length - 1) {
      if ("human_message" in message) {
        mappedMessages.push(new HumanMessage(message.human_message));
      }
      if ("ai_message" in message) {
        mappedMessages.push(new AIMessage(message.ai_message));
      }
    }
  });

  mappedMessages.push(new HumanMessage(req.body.query));

  const chain = prompt.pipe(llm);
  const result = await chain.invoke({
    input_documents: docs,
    units: measuringUnits,
    messages: mappedMessages,
    userPrompt: req.body.query,
  });
  console.log("result", result);
  res.status(200).json(result);
}

async function embedQuery(
  query: string,
  embeddings: OpenAIEmbeddings
): Promise<number[]> {
  const embeddedQuery = await embeddings.embedQuery(query);
  return embeddedQuery;
}

async function similarityVectorSearch(
  vectorQuery: number[],
  k = 1,
  indexx: any,
  namespace: string
): Promise<Document[]> {
  const pinecone = new Pinecone({
    apiKey: pineconeApiKey as string,
  });

  const index = pinecone.index("highfeast1");
  const results = await index.query({
    vector: vectorQuery,
    topK: k,
    includeMetadata: true,
  });

  const result: [Document, number][] = [];

  if (results.matches) {
    for (const res of results.matches) {
      console.log("res", res);
      const { text: pageContent, ...metadata } =
        res?.metadata as PineConeMetadata;
      if (res.score) {
        result.push([new Document({ metadata, pageContent }), res.score]);
      }
    }
  }

  return result.map((result) => result[0]);
}
