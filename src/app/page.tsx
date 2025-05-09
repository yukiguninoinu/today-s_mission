import { Main } from "@/components/TodoPage/Main";
import { Sidebar } from "@/components/TodoPage/Sidebar";
import Style from "./page.module.css";
import { Input } from "@/components/TodoPage/Input";
import { Header } from "@/components/TodoPage/Header";

export default function TodoPage() {
  return (
    <div>
      <Header />
      <div className={Style.MainPage}>
        <Sidebar />
        <Main />
        <Input />
      </div>
    </div>
  );
}
