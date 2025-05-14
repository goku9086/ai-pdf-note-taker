import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";

import { action } from "./_generated/server.js";

import { TaskType } from "@Google/generative-ai";
import { v } from "convex/values";
import { api } from "./_generated/api.js";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

export const ingest = action({
  args: {
    splitText: v.any(),   // Array of text chunks
    fileId: v.string()    // File identifier
  },
  handler: async (ctx, args) => {
    await ConvexVectorStore.fromTexts(
      args.splitText,
      // ✅ Pass metadata as an array of objects
      args.splitText.map(() => ({ fileId: args.fileId })),
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyA1PGU4Uv0kE76XntMhVR9zYWIL7rxqEOY',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
      { ctx }
    );

    return "Completed..";
  },
});


export const search = action({
  args: {
    query: v.string(),
    fileId:v.string()
  },
  handler: async (ctx, args) => {
    const vectorStore = new ConvexVectorStore(
      new GoogleGenerativeAIEmbeddings({
        apiKey: 'AIzaSyA1PGU4Uv0kE76XntMhVR9zYWIL7rxqEOY',
        model: "text-embedding-004", // 768 dimensions
        taskType: TaskType.RETRIEVAL_DOCUMENT,
        title: "Document title",
      }),
       { ctx });  

    const resultOne = await (await vectorStore.similaritySearch(args.query, 1))
    .filter(q=>q.metadata.fileId==args.fileId)
    console.log(resultOne);

    return JSON.stringify(resultOne);
  },
});