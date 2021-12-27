import cloudinary from "cloudinary";

export default async function handler(req, res) {
  const timestamp = new Date().getTime();
  const signature = await cloudinary.utils.api_sign_request(
    { timestamp },
    process.env.CLOUDINARY_API_SECRET
  );

  res.json({ timestamp, signature });
}