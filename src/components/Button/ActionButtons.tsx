import React from "react";
import Style from "./ActionButtons.module.css";

interface ActionButtonProps {
  label: string;
  onClick?: () => void;
}

export function ActionButton({ label, onClick }: ActionButtonProps) {
  return (
    <button className={Style.Action_btn} onClick={onClick}>
      {label}
    </button>
  );
}
