
import { getUserServer } from "@/lib/supabase/getUserServer";
import loadHomeServer from "@/services/home/loadHomeServer";
import { redirect } from "next/navigation";

export default async function ShoppingPage() {
  const { user } = await getUserServer();
  if (!user) redirect("/login");

  const data = await loadHomeServer(user.id);
  const items: string[] = data.shoppingList ?? [];

  return (
    <div className="px-4 py-6">
      <h1 className="text-xl font-semibold mb-4">Lista de compras</h1>

      {items.length === 0 && <p>Nenhum item gerado pela IA ainda.</p>}

      <ul className="space-y-3">
        {items.map((item, i) => (
          <li
            key={i}
            className="p-4 bg-white shadow rounded-xl text-gray-800"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
