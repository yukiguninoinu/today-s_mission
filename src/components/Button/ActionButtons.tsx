import React from "react";
import Style from "./ActionButtons.module.css";

export function ActionButton({ label }: { label: string }) {
  return <span className={Style.Action_btn}>{label}</span>;
}
