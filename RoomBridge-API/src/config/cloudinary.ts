import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

// Room images live in cloud storage, never on the local filesystem:
// Vercel/Railway disks are ephemeral and would wipe uploads on every redeploy.
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;
