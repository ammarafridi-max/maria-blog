const parseList = (value, fallback = []) => {
  if (!value || typeof value !== "string") return fallback;
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

export default {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseNumber(process.env.PORT, 4000),
  mongoUri: process.env.MONGO_URI,

  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  jwtCookieExpiresInDays: parseNumber(process.env.JWT_COOKIE_EXPIRES_IN, 7),

  adminEmail: process.env.ADMIN_EMAIL ?? "maria@example.com",

  corsOrigins: parseList(process.env.CORS_ORIGINS, ["http://localhost:3000"]),

  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",

  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },

  // Optional AI blog-assist keys. Endpoints return 503 until these are set.
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  recraftApiKey: process.env.RECRAFT_API_KEY,
};
