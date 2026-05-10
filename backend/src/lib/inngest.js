import { Inngest } from "inngest";
import { User } from "../models/User.js";

export const inngest = new Inngest({ id: "InterviewPro" });

const syncUser = inngest.createFunction(
  { 
    id: "sync-user",
    triggers: [{ event: "clerk/user.created" }] 
  },
  async ({ event }) => {
    const { id, email_addresses, first_name, last_name, profile_image_url } = event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImg: profile_image_url || "",
    };
    const user = await User.create(newUser);
    console.log("Created user:", user);
  }
);

const deleteUser = inngest.createFunction(
  { 
    id: "delete-user",
    triggers: [{ event: "clerk/user.deleted" }] 
  },
  async ({ event }) => {
    const { id } = event.data;
    const user = await User.findOneAndDelete({ clerkId: id });
    console.log("Deleted user:", user);
  }
);

export const InngestFunctions = [syncUser, deleteUser];