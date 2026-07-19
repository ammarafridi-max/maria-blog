import { Router } from "express";
import { createAuthRouter } from "../domains/auth/index.js";
import { createAdminUsersRouter } from "../domains/admin-users/index.js";
import { createBlogRouter, createBlogTagRouter } from "../domains/blog/index.js";
import { createCloudinaryStorage } from "../lib/cloudinary.js";
import { logger } from "../lib/logger.js";
import { db } from "../lib/db.js";
import config from "../config.js";

const router = Router();

// Auth first: this registers the `admin-user` model that the blog schema
// references (author/publisher) and returns the shared auth middleware.
const { router: authRouter, middleware: auth, AdminUser } = createAuthRouter({
  db,
  jwtSecret: config.jwtSecret,
  jwtExpiresIn: config.jwtExpiresIn,
  cookieExpiresInDays: config.jwtCookieExpiresInDays,
  nodeEnv: config.nodeEnv,
});

router.use("/auth", authRouter);
router.use("/admin-users", createAdminUsersRouter({ AdminUser, auth }));

const imageStorage = createCloudinaryStorage({
  cloudName: config.cloudinary.cloudName,
  apiKey: config.cloudinary.apiKey,
  apiSecret: config.cloudinary.apiSecret,
  logger,
  folder: "maria-blog/blog",
});

router.use(
  "/blogs",
  createBlogRouter({ db, auth, imageStorage, anthropicApiKey: config.anthropicApiKey }),
);
router.use("/blog-tags", createBlogTagRouter({ db, auth }));

export default router;
