"use client";
import React from "react";
import { useState } from "react";
import styles from "./SignUpForm.module.css";
import FormButton from "../Button/FormButtons";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("サインアップ:", { email, password });
    // アカウント作成処理を書く
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>サインアップ</h2>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <FormButton>登録する</FormButton>
    </form>
  );
}
