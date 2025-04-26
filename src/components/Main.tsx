import React from "react";
import Style from "./Main.module.css";
import { Button } from "./Button/DeleteButton";
import { ActionButton } from "./Button/ActionButtons";

export function Main() {
  return (
    <div className={Style.Main}>
      <div className={Style.TodoArea}>
        <Button />
        <h2 className={Style.TodoTitle}>今日のTODOリスト</h2>
        <label className={Style.ListItem}>
          <input
            type="checkbox"
            name="checkbox"
            value="リスト1"
            className="checkbox"
          />
          <span className={Style.ItemText}>リスト1</span>
          <ActionButton label="編集" />
        </label>
        <label className={Style.ListItem}>
          <input
            type="checkbox"
            name="checkbox"
            value="リスト2"
            className="checkbox"
          />
          <span className={Style.ItemText}>リスト2</span>
          <ActionButton label="編集" />
        </label>
        <label className={Style.ListItem}>
          <input
            type="checkbox"
            name="checkbox"
            value="リスト3"
            className="checkbox"
          />
          <span className={Style.ItemText}>リスト3</span>
          <ActionButton label="編集" />
        </label>
        <div className={Style.DoneArea}>
          <hr />
          <label className={Style.ListItem}>
            <input
              type="checkbox"
              name="checkbox"
              value="リスト4"
              className="checkbox"
            />
            <span className={Style.ItemText}>リスト4</span>
            <ActionButton label="編集" />
          </label>
        </div>
      </div>
    </div>
  );
}
