"use server";

import { v2 as cloudinary } from "cloudinary";

const config = {
  cloud_name: "doimcmi2g",
  api_key: "168976985717984",
  api_secret: "V_j7C1WQhhMe1ZSytD8QMc7x5FQ",
};

cloudinary.config(config);

export async function createImageUpload(id: string) {
  const timestamp = Math.round(Date.now() / 1000);
  const params = {
    timestamp: timestamp,
    public_id: id,
  };
  console.log(process.env.CLOUDINARY_SECRET);

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_SECRET,
  );
  return { timestamp, signature };
}
