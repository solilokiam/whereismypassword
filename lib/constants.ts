export const rpId = process.env.VERCEL_URL || "localhost";
export const origin = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";
