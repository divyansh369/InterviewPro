import { Inngest } from "inngest";
import { User } from "../models/User.js";
import { ENV } from "./env.js";
import { deleteStreamUser, upsertStreamUser } from "./stream.js";

export const inngest = new Inngest({
  id: "InterviewPro",
  eventKey: ENV.INNGEST_EVENT_KEY,
});

const syncUser = inngest.createFunction(
  {
    id: "sync-user",
    triggers: { event: "clerk/user.created" },
  },
  async ({ event }) => {
    // ==== save the user data to the database ====
    const { id, email_addresses, first_name, last_name, profile_image_url } =
    event.data;
    const newUser = {
      clerkId: id,
      email: email_addresses[0].email_address,
      name: `${first_name || ""} ${last_name || ""}`.trim(),
      profileImg: profile_image_url || "",
    };
    const user = await User.create(newUser);

    // ==== save the user data to stream ====
    await upsertStreamUser({
      id: newUser.clerkId.toString(),
      name: newUser.name,
      image: newUser.profileImg,
    });
  },
);

const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    triggers: { event: "clerk/user.deleted" },
  },

  async ({ event }) => {
    // ==== delete the user data from the database ====
    const { id } = event.data;
    const user = await User.findOneAndDelete({ clerkId: id });
    console.log("Deleted user:", user);

    // ==== delete the user from stream ====
    await deleteStreamUser(id.toString());
  },
);

export const InngestFunctions = [syncUser, deleteUser];
