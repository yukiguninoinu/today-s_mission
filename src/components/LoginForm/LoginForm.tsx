"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import styles from "./LoginForm.module.css";
import FormButton from "../Button/FormButtons";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      return;
    }

    // ログイン成功後にセッションを取得
    const {
      data: { session },
    } = await supabase.auth.getSession();
    console.log("ログイン中のセッション:", session);
    if (session?.user) {
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("nickname")
        .eq("id", session.user.id)
        .single();

      if (!error) {
        console.log("ニックネーム:", profile.nickname);
        // ここでstateに保存して画面に表示など
      }
    }

    router.push("/"); // ログイン成功後に遷移
  };

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      <h2>Today`s Mission</h2>
      <h3>ログインして始めよう！</h3>
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
      <FormButton>ログイン</FormButton>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p className={styles.signUpLink}>
        まだアカウントをお持ちでないですか？
        <br />
        <a href="/signup">サインアップはこちら</a>
      </p>
    </form>
  );
}
