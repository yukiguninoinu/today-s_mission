import React from "react";
import Style from "./page.module.css";
import { SignUpForm } from "@/components/SignUpForm/SignUpForm";

export default function Home() {
  return (
    <div className={Style.SignUpPage}>
      <div className={Style.PageLeft}>
        <h1>Today`s Mission</h1>
        <h3>今日のミッションを上手に管理して、</h3>
        <h3>素敵な1日にしよう!</h3>
      </div>
      <div className={Style.PageRight}>
        <SignUpForm />
      </div>
    </div>
  );
}
