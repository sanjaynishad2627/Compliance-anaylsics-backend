import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authrouter from "./api/routes/auth.routes.js";
import organizationRouter from "./api/routes/organization.routes.js";
import frameworkRouter from "./api/routes/framework.route.js";
import productRoute from "./api/routes/product.routes.js";
import complianceRoute from "./api/routes/compliance.routes.js";
import cors from "cors";
dotenv.config();
const app = express();

//  cors:
app.use(
  cors({
    origin: ["http://localhost:5173", 'https://compliance-analysis-blue.vercel.app', 'https://compliance-anaylsics-frontend.vercel.app', "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

// Purana cors wala code hata kar sirf ye simple block daal do
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://compliance-anaylsics-frontend.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Sabse zaroori: Preflight request ko yahin par response dekar khatam karo
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

//  middleware:
app.use(express.json());
app.use(cookieParser());

//  routes
app.use("/api/auth", authrouter);
app.use("/api/organization", organizationRouter);
app.use("/api/framework", frameworkRouter);
app.use("/api/product", productRoute);
app.use("/api/compliance", complianceRoute);

export default app;
