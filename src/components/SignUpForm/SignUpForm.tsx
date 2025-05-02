"use client";
import React from "react";
import { useState } from "react";
import styles from "./SignUpForm.module.css";
import FormButton from "../Button/FormButtons";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, nickname }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "サインアップ失敗");

      console.log("✅ ユーザー登録成功:", data);
      // 必要に応じて遷移やメッセージ表示
    } catch (error: any) {
      console.error("❌ サインアップ失敗:", error.message);
      // エラーメッセージの表示処理など
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2>サインアップ</h2>
      <input
        type="text"
        placeholder="ニックネーム"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        required
      />
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
