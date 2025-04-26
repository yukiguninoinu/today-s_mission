import { Main } from "@/components/Main";
import { Sidebar } from "@/components/Sidebar";
import Style from "./page.module.css";
import { Input } from "@/components/Input";

export default function EditPage() {
  return (
    <div className={Style.MainPage}>
      <Sidebar />
      <Main />
      <Input />
    </div>
  );
}
