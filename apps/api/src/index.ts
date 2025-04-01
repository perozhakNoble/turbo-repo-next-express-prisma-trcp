import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "@repo/db";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Legacy REST endpoints
app.get("/status", (_: Request<{}, any, any>, res: Response) => {
  res.send("API running");
});

app.get("/users", async (_, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const newUser = await prisma.user.create({
    data: { name, email },
  });
  res.json(newUser);
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`API listening on port ${port}`));
