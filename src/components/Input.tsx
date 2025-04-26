import React from "react";
import Style from "./Input.module.css";
import { Button } from "./Button/DeleteButton";
import { ActionButton } from "./Button/ActionButtons";

export function Input() {
  return (
    <div className={Style.InputArea}>
      <Button />
      <h2 className={Style.InputTitle}>NEWTODO</h2>
      <label htmlFor="inputtodo">TODO</label>
      <input
        id="inputtodo"
        name="inputtodo"
        type="text"
        className={Style.InputTodo}
        placeholder="入力"
      ></input>
      <label htmlFor="inputpriority">優先度</label>
      <select
        id="inputpriority"
        name="inputpriority"
        className={Style.InputPriority}
      >
        <option value="">普通</option>
        <option value="高い">高い</option>
        <option value="低い">低い</option>
      </select>

      <label htmlFor="inputmemo">MEMO</label>
      <textarea
        id="inputmemo"
        name="inputmemo"
        rows={10}
        maxLength={100}
        className={Style.InputMemo}
        placeholder="入力"
      ></textarea>
      <div className={Style.InputButtonArea}>
        <ActionButton label="キャンセル" />
        <ActionButton label="追加" />
      </div>
    </div>
  );
}
