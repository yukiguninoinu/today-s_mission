import React from "react";
import Style from "./page.module.css";
import { LoginForm } from "@/components/LoginForm/LoginForm";

export default function Home() {
  return (
    <div className={Style.LoginPage}>
      <div className={Style.PageLeft}>
        <h1>Today`s Mission</h1>
        <h3>おかえりなさい！</h3>
        <h3>今日も素敵な1日にしよう!</h3>
      </div>
      <div className={Style.PageRight}>
        <LoginForm />
      </div>
    </div>
  );
}
