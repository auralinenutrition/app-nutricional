"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, Upload } from "lucide-react";

export default function EditProfilePage() {
  const router = useRouter();
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  const [name, setName] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [metaAgua, setMetaAgua] = useState("");
  const [metaCalorias, setMetaCalorias] = useState("");
  const [metaRefeicoes, setMetaRefeicoes] = useState("");

  useEffect(() => {
    if (!user) return;

    supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single()
      .then(({ data }) => {
        if (!data) return;

        setProfile(data);
        setName(data.name ?? "");
        setMetaAgua(data.meta_agua ?? "");
        setMetaCalorias(data.meta_calorias ?? "");
        setMetaRefeicoes(data.meta_refeicoes ?? "");
        setPreview(data.photo_url ?? null);
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);

    let photoURL = preview;

    // Se o usuário mudou a foto
    if (photo) {
      const fileExt = photo.name.split(".").pop();
      const filePath = `profiles/${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, photo, { upsert: true });

      if (!uploadError) {
        const { data } = supabase.storage
          .from("user-uploads")
          .getPublicUrl(filePath);

        photoURL = data.publicUrl;
      }
    }

    // Atualiza no Supabase
    const { error } = await supabase
      .from("users")
      .update({
        name,
        photo_url: photoURL,
        meta_agua: Number(metaAgua),
        meta_calorias: Number(metaCalorias),
        meta_refeicoes: Number(metaRefeicoes),
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      alert("Erro ao salvar: " + error.message);
      return;
    }

    router.push("/profile");
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    setPhoto(f);
    setPreview(URL.createObjectURL(f));
  };

  if (!profile) {
    return <div className="p-6 text-center text-gray-500">Carregando...</div>;
  }

  return (
    <div className="p-6 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.push("/profile")}>
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Editar Perfil</h1>
      </div>

      {/* Foto */}
      <div className="flex flex-col items-center mb-8">
        <label className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden cursor-pointer relative">
          {preview ? (
            <img
              src={preview}
              alt="Foto do perfil"
              className="object-cover w-full h-full"
            />
          ) : (
            <Upload className="text-gray-600" size={28} />
          )}

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoSelect}
          />
        </label>

        <p className="mt-2 text-sm text-gray-500">Toque para alterar foto</p>
      </div>

      {/* Formulário */}
      <div className="space-y-6">
        {/* NOME */}
        <div>
          <label className="font-medium text-sm">Nome</label>
          <input
            type="text"
            className="w-full mt-1 p-3 rounded-xl border border-gray-300"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* METAS PERSONALIZADAS */}
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-4">
          <h2 className="text-sm font-semibold text-gray-700">
            Metas Personalizadas
          </h2>

          <div>
            <label className="text-sm">Meta de Água (ml)</label>
            <input
              type="number"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300"
              value={metaAgua}
              onChange={(e) => setMetaAgua(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Meta de Calorias</label>
            <input
              type="number"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300"
              value={metaCalorias}
              onChange={(e) => setMetaCalorias(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm">Refeições por dia</label>
            <input
              type="number"
              className="w-full mt-1 p-3 rounded-xl border border-gray-300"
              value={metaRefeicoes}
              onChange={(e) => setMetaRefeicoes(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full mt-10 h-14 rounded-full bg-[#00C974] text-white text-lg font-medium disabled:opacity-60"
      >
        {loading ? "Salvando..." : "Salvar alterações"}
      </button>
    </div>
  );
}
