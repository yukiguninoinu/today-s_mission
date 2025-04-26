import React from "react";
import Styles from "./Sidebar.module.css";
import { Button } from "./Button/SidebarButton";

export function Sidebar() {
  return (
    <div className={Styles.Sidebar}>
      <h2>今日も頑張ろう！</h2>

      <Button />
      <ul>
        <li>
          <button>新規リスト</button>
        </li>

        <li>
          <button>新規リスト</button>
        </li>
      </ul>
    </div>
  );
}
