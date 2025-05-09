import React, { useState, useEffect } from "react";

// ポジティブなメッセージリスト
const positiveMessages = [
  "今日も頑張ろう！",
  "素晴らしい一日を\n過ごしてね！",
  "あなたはできる！",
  "前向きに行こう！",
  "一歩ずつ進んでいこう！",
  "自分を信じて！",
  "今日も最高の\n一日になるよ！",
  "笑顔で乗り越えよう！",
  "頑張りすぎず、\nでもしっかりと！",
  "あなたの努力は\n無駄にならないよ！",
];

// サーバーサイドでメッセージを決める
export const Message = ({ initialMessage }: { initialMessage: string }) => {
  const [message, setMessage] = useState<string>(initialMessage);

  // 定期的にメッセージを更新する
  useEffect(() => {
    const interval = setInterval(() => {
      const randomMessage =
        positiveMessages[Math.floor(Math.random() * positiveMessages.length)];
      setMessage(randomMessage);
    }, 100000); // 100秒ごとにメッセージ更新

    // クリーンアップ
    return () => clearInterval(interval);
  }, []);

  // 改行を含むメッセージを処理
  const renderMessage = message.split("\n").map((str, index) => (
    <React.Fragment key={index}>
      {str}
      <br />
    </React.Fragment>
  ));

  return <h2>{renderMessage}</h2>; // ランダムメッセージを表示
};

// サーバーサイドで呼び出す部分（SSRの場合）
// 例えば、Next.js であれば `getServerSideProps` や `getStaticProps` を使う
export async function getServerSideProps() {
  const initialMessage =
    positiveMessages[Math.floor(Math.random() * positiveMessages.length)];

  return {
    props: { initialMessage }, // メッセージを渡す
  };
}
