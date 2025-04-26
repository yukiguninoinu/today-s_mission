import { Input } from "@/components/Input";
import { Main } from "@/components/Main";
import { Sidebar } from "@/components/Sidebar";
import Style from "./page.module.css";

export default function Home() {
  return (
    <div className={Style.MainPage}>
      <Sidebar />
      <Main />
      <Input />
    </div>
  );
}
