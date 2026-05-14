import React from "react";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import toast from "react-hot-toast";

const HomePage = () => {
  return (
    <>
        <button className="btn btn-secondary" onClick={() => toast.success("This is a success toast")}>Click Me</button>
      <Show when="signed-out">
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </Show>
      <Show when="signed-in">
        <UserButton />
      </Show>
    </>
  );
};

export default HomePage;
