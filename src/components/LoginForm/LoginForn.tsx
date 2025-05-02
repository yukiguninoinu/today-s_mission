"use client";
import React from "react";
import { useState } from "react";
import styles from "./LoginForm.module.css";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("ログイン:", { email, password });
    // ログイン処理を書く
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>ログイン</h2>
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
      <button className={styles.submitButton} type="submit">
        ログイン
      </button>
    </form>
  );
}
