import React from "react";
import Style from "./page.module.css";
import { LoginForm } from "@/components/LoginForm/LoginForm";

export default function Home() {
  return (
    <div className={Style.LoginPage}>
      <LoginForm />
    </div>
  );
}
