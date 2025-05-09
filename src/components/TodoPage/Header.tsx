"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

export function Header() {
  const [nickname, setNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // ニックネームを取得する関数
  const fetchNickname = async (userId: string) => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nickname")
      .eq("id", userId)
      .single();

    if (profile) {
      setNickname(profile.nickname);
    }
  };

  useEffect(() => {
    // 初回ロード時：セッションをチェック
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setIsLoggedIn(true);
        fetchNickname(session.user.id);
      } else {
        setIsLoggedIn(false);
        setNickname("");
      }
    };

    checkSession();

    // 🔄 onAuthStateChangeでセッションを監視（ログイン・ログアウト時に発火）
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setIsLoggedIn(true);
          fetchNickname(session.user.id);
        } else {
          setIsLoggedIn(false);
          setNickname("");
        }
      }
    );

    // 🧹 クリーンアップ（アンマウント時）
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  return (
    <header className={styles.header}>
      <h3>Today's Mission</h3>
      <div className={styles.userArea}>
        {isLoggedIn ? (
          <>
            <span>こんにちは、{nickname} さん</span>
            <button onClick={handleLogout}>ログアウト</button>
          </>
        ) : (
          <button onClick={handleGoToLogin}>ログイン</button>
        )}
      </div>
    </header>
  );
}
