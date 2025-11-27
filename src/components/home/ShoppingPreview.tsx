import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

type ShoppingPreviewProps = {
  items: string[];
};

export default function ShoppingPreview({ items } : ShoppingPreviewProps) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 relative">

      <div
        className="absolute right-4 top-4 cursor-pointer text-gray-400"
        onClick={() => router.push("/shopping")}
      >
        <ChevronRight size={22} />
      </div>

      <h3 className="font-semibold text-lg">Lista de compras</h3>
      <p className="text-gray-600 mt-2">
        {items.length === 0 ? "Nenhum item gerado ainda" : "Itens sugeridos"}
      </p>
    </div>
  );
}
