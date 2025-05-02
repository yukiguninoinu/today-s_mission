import { Main } from "@/components/TodoPage/Main";
import { Sidebar } from "@/components/TodoPage/Sidebar";
import Style from "./page.module.css";
import { Input } from "@/components/TodoPage/Input";

export default function TodoPage() {
  return (
    <div className={Style.MainPage}>
      <Sidebar />
      <Main />
      <Input />
    </div>
  );
}
