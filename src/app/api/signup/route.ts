import { NextResponse } from "next/server";
import { supabase } from "../../../../lib/supabaseClient";

export async function POST(req: Request) {
  const { email, password, nickname } = await req.json();

  if (!email || !password || !nickname) {
    return NextResponse.json(
      { message: "すべての項目を入力してください" },
      { status: 400 }
    );
  }

  try {
    // ユーザー登録
    const { data: auth, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (authError) throw authError;
    const userId = auth.user?.id;

    // プロフィール作成
    const { error: profileError } = await supabase.from("profiles").insert({
      id: userId,
      nickname: nickname,
  });

    if (profileError) throw profileError;

    return NextResponse.json({ message: "ユーザー登録成功" }, { status: 201 });
  } catch (error: any) {
    console.error("エラー:", error.message);
    // return NextResponse.json({ message: "登録エラー", error: error.message }, { status: 500 });
    let message = "登録エラー";
    if (error.message.includes("User already registered")) {
      message = "すでにアカウントをお持ちです";
      return NextResponse.json({ message }, { status: 400 });
    }

    return NextResponse.json({ message, error: error.message }, { status: 500 });
  }
}
