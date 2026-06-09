import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import { db } from "./config/db.js";
import { Framework } from "./api/models/framework.schema.js";
import { chunkFramework } from "./utils/chunking.js";
import { generateEmbedding } from "./utils/embeddings.js";
import qdrantClient from "./config/qdrant.js";
import { randomUUID } from "crypto";

const syncNow = async () => {
  try {
    await db();
    
    console.log("Fetching active frameworks from MongoDB...");
    const frameworks = await Framework.find({ isActive: true });
    
    if (!frameworks || frameworks.length === 0) {
      console.log("No active frameworks found to sync.");
      process.exit(0);
    }

    console.log(`Found ${frameworks.length} framework(s). Syncing to Qdrant...`);
    let totalChunksSynced = 0;

    for (const framework of frameworks) {
      const chunks = chunkFramework(framework);
      console.log(`Chunking framework ${framework.name} into ${chunks.length} chunks...`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        process.stdout.write(`Generating embedding for chunk ${i+1}/${chunks.length}... `);
        
        const vector = await generateEmbedding(chunk.text);
        
        await qdrantClient.upsert("frameworks", {
          wait: true,
          points: [
            {
              id: randomUUID(),
              vector: vector,
              payload: {
                text: chunk.text,
                ...chunk.metadata
              }
            }
          ]
        });
        
        process.stdout.write("Done!\n");
        totalChunksSynced++;
      }
    }

    console.log(`\n✅ Successfully synced ${frameworks.length} frameworks (${totalChunksSynced} total chunks) to Qdrant.`);
    process.exit(0);
  } catch (err) {
    console.error("\n❌ Vector DB Sync Error:", err);
    process.exit(1);
  }
};

syncNow();
