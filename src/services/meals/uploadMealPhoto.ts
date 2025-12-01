export async function uploadMealPhoto(file: File) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("/api/uploads/meal-photo", {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Upload failed");
  return await res.json();
}
