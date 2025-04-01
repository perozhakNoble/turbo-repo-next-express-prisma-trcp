import { initTRPC } from "@trpc/server";
import { ZodError } from "zod";
import { TRPCError } from "@trpc/server";

export const t = initTRPC.create({
  errorFormatter(opts) {
    const { shape, error } = opts;
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.code === "BAD_REQUEST" && error.cause instanceof ZodError
            ? error.cause.flatten()
            : null,
        prismaError:
          error.code === "INTERNAL_SERVER_ERROR" &&
          error.cause?.name === "PrismaClientKnownRequestError"
            ? {
                code: error.code,
                message: error.cause.message,
              }
            : null,
      },
    };
  },
});

// Helper function to create custom errors
export const createError = (
  code: TRPCError["code"],
  message: string,
  cause?: unknown
) => {
  throw new TRPCError({
    code,
    message,
    cause,
  });
};
