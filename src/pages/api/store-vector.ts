import { filePath } from "@/utils/consts";
import { extractTableData } from "@/utils/helpers";
import { Pinecone } from "@pinecone-database/pinecone";
import { stringify } from "csv-stringify";
import fs from "fs";
import { Document } from "langchain/document";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import mammoth from "mammoth";
import type { NextApiRequest, NextApiResponse } from "next";
import { promisify } from "util";

const readFileAsync = promisify(fs.readFile);

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY as string,
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY as string,
  });

  let csvData;

  try {
    const fileContent = await readFileAsync(filePath);
    const { value } = await mammoth.convertToHtml({ buffer: fileContent });
    const tableData = extractTableData(value);

    csvData = await new Promise<string>((resolve, reject) => {
      stringify(tableData, { header: true }, (err: any, output: any) => {
        if (err) reject(err);
        else resolve(output);
      });
    });
  } catch (error: any) {
    console.error("Error loading menu data:", error);
    res.status(500).json({ message: "Failed to load menu data" });
  }

  if (!csvData) {
    console.error("could not extract data");
    return;
  }

  const document = [
    new Document({
      pageContent: csvData!,
      metadata: { menu: "jollof rice" },
    }),
  ].map((x) => x.pageContent);

  const metadata = [
    new Document({
      pageContent: csvData!,
      metadata: { menu: "jollof rice" },
    }),
  ].map((x) => x.metadata);

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 900,
  });

  console.log("Text Splitting......");
  console.log(`Chunk size  ----> ${textSplitter.chunkSize}`);
  console.log(`Chunk Overlap  ----> ${textSplitter.chunkOverlap}`);

  const splitDocs = await textSplitter.createDocuments(document, metadata, {
    appendChunkOverlapHeader: true,
  });

  const pineconeIndex = pinecone.index("highfeast1");

  async function addDocuments(
    documents: Document[],
    ids?: string[]
  ): Promise<void> {
    const texts = documents.map(({ pageContent }) => pageContent);
    return addVectors(await embeddings.embedDocuments(texts), documents, ids);
  }

  async function addVectors(
    vectors: number[][],
    documents: Document[],
    ids?: string[]
  ): Promise<void> {
    const upsertRequest = {
      vectors: vectors.map((values, idx) => ({
        id: `${idx}`,
        metadata: {
          menu: documents[idx].metadata.menu,
          text: documents[idx].pageContent,
        },
        values,
      })),
      namespace: "c",
    };

    await pineconeIndex.upsert(upsertRequest.vectors);
  }

  await addDocuments(splitDocs);

  const indexData = await pineconeIndex.describeIndexStats();

  res.status(200).json({ message: indexData as string });
}
