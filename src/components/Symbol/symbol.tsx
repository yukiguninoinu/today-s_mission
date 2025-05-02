import React from "react";
import Style from "./symbol.module.css";

export function Symbol() {
  return (
    <div className={Style.symbol}>
      <div className={Style.line1}></div>
      <div className={Style.line}></div>
      <div className={Style.line}></div>
      <div className={Style.line}></div>
      <div className={Style.line}></div>
    </div>
  );
}
