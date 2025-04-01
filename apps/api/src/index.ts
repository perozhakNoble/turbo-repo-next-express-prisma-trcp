import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./router";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// tRPC middleware
app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
  })
);

app.use("/panel", (async (_: Request, res: Response) => {
  if (process.env.SWAGGER_UI_ENABLED !== "true") {
    return res.status(404).send("Not Found");
  }

  // Dynamically import renderTrpcPanel only in development
  const { renderTrpcPanel } = await import("trpc-ui");

  return res.send(
    renderTrpcPanel(appRouter, {
      url: `http://localhost:${port}/trpc`,
      meta: {
        title: "Pool Pet API",
      },
    })
  );
}) as any);

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
