import { createImageUpload } from "@/lib/cloudinary";

export const uploadFile = async (file: File, id: string) => {
  const formData = new FormData();
  const { timestamp, signature } = await createImageUpload(id);
  formData.append("file", file);
  formData.append("public_id", id);

  await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/image/upload?api_key=${process.env.NEXT_PUBLIC_CLOUDINARY_KEY}&timestamp=${timestamp}&signature=${signature}`,
    {
      method: "POST",
      body: formData,
    },
  );
};
