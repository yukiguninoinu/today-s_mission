import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";


const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 注意：Service Role Keyは.env.server側のみ
);

export async function POST(req: Request) {
  const { email, password, nickname } = await req.json();

  if (!email || !password || !nickname) {
    return NextResponse.json(
      { message: "すべての項目を入力してください" },
      { status: 400 }
    );
  }

  try {
    // ユーザー作成
    const { data: signUpData, error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (signUpError) throw signUpError;
    const userId = signUpData.user?.id;

    // プロフィール作成
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: userId,
        nickname: nickname,
      },
    ]);

    if (profileError) throw profileError;

    return NextResponse.json({ message: "ユーザー登録成功" }, { status: 201 });
  } catch (error: any) {
    console.error("エラー:", error.message);
    return NextResponse.json({ message: "登録エラー", error: error.message }, { status: 500 });
  }
}
