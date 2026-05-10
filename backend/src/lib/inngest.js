import { Inngest } from "inngest";
import { connectDB } from "./database.js";
import { User } from "../models/User.js";

export const inngest = new Inngest({ id: "InterviewPro" });

const syncUser = inngest.createFunction(
  { id: "sync-user", event:"clerk/user.created" },
  async ({ event }) => {
    // get user details from event data and create user in db
    const { id, email_addresses, first_name, last_name, profile_image_url } =
      event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImg: profile_image_url || "",
    };
    const user = await User.create(newUser);
    console.log("Created user : ", user);
    //todo : do something else
  },
);

// delete user when user is deleted in clerk (assuming clerk.user.deleted event is triggered on user deletion in clerk)
const deleteUser = inngest.createFunction(
  { id: "delete-user", event: "clerk/user.deleted" },
  async ({ event }) => {
    const { id } = event.data;
    const user = await User.findOneAndDelete({ clerkId: id });
    console.log("Deleted user : ", user);

    //todo : do something else
  },
);

export const InngestFunctions = [syncUser, deleteUser];
