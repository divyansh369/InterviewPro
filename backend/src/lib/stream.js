import { StreamChat } from "stream-chat";
import { ENV } from "./env.js";

if (!ENV.STREAM_API_KEY || !ENV.STREAM_API_SECRET) {
  console.log("Stream API KEY || SECRET KEY not found !!!");
}

export const chatClient = StreamChat.getInstance(ENV.STREAM_API_KEY,ENV.STREAM_API_SECRET);

export const upsertStreamUser = async (userData) => {
    try {
        await chatClient.upsertUser(userData);
        console.log(`Stream user ${userData.id} upserted successfully.`, userData);
    } catch (error) {
        console.error(`Error upserting Stream user ${userData.id}:`, error);
    }
}

export const deleteStreamUser = async (userId) => {
    try {
        await chatClient.deleteUser(userId);
        console.log(`Stream user ${userId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting Stream user ${userId}:`, error);
    }
}