"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import styles from "./Header.module.css";

type HeaderProps = {
  setCurrentView: (view: "main" | "sidebar" | "input") => void;
};

export function Header({ setCurrentView }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [nickname, setNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // メニューを開閉するための関数
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

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
      },
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

      {/* モバイル時のみハンバーガーメニュー */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={styles.hamburger}
      >
        ☰
      </button>
      {/* デスクトップ時に表示されるユーザー情報 */}
      <div className={styles.userArea}>
        {isLoggedIn ? (
          <>
            <span className={styles.nickname}>こんにちは、{nickname} さん</span>
            <button onClick={handleLogout}>ログアウト</button>
          </>
        ) : (
          <button onClick={handleGoToLogin}>ログイン</button>
        )}
      </div>
      {/* ハンバーガーメニューが開いている場合に表示 */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul>
            {isLoggedIn && (
              <li className={styles.mobileNickname}>{nickname} さん</li>
            )}
            {isLoggedIn ? (
              <li onClick={handleLogout}>ログアウト</li>
            ) : (
              <li onClick={handleGoToLogin}>ログイン</li>
            )}

            <li
              onClick={() => {
                setCurrentView("sidebar");
                setMenuOpen(false);
              }}
            >
              リスト一覧
            </li>
            <li
              onClick={() => {
                setCurrentView("main");
                setMenuOpen(false);
              }}
            >
              TODO
            </li>
            <li
              onClick={() => {
                setCurrentView("input");
                setMenuOpen(false);
              }}
            >
              追加・編集
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
