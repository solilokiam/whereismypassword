"use client";
import { logout } from "@/app/logout/action";
import React from "react";

const Logout = () => {
  return <button onClick={() => logout()}>Logout</button>;
};

export default Logout;
