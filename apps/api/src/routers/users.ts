import { t } from "../trpc";
import { z } from "zod";
import { prisma } from "@repo/db";
import { createError } from "../trpc";

export const usersRouter = t.router({
  getUser: t.procedure.input(z.string()).query(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: { id: input },
    });

    if (!user) {
      createError("NOT_FOUND", `User with ID ${input} not found`);
    }

    return user;
  }),

  createUser: t.procedure
    .input(
      z.object({
        name: z.string().min(5),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser) {
          createError("BAD_REQUEST", "User with this email already exists");
        }

        const user = await prisma.user.create({
          data: input,
        });
        return user;
      } catch (error) {
        if (error instanceof Error) {
          createError("INTERNAL_SERVER_ERROR", "Failed to create user", error);
        }
        throw error;
      }
    }),

  getUsers: t.procedure.query(async () => {
    try {
      const users = await prisma.user.findMany();
      return users;
    } catch (error) {
      if (error instanceof Error) {
        createError("INTERNAL_SERVER_ERROR", "Failed to fetch users", error);
      }
      throw error;
    }
  }),
});
