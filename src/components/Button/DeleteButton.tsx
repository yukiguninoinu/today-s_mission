import React from "react";
import Style from "./DeleteButton.module.css";

type DeleteButtonProps = {
  onClick: () => void;
};

export const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return <button className={Style.round_btn} onClick={onClick}></button>;
};
