// types/todo.ts
export type Todo = {
  id: string;
  title: string;
  note: string;
  priority: "高い" | "普通" | "低い";
  created_at: string;
  list_id: string;
  is_done: boolean;
};
