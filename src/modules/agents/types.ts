import type { AppRouter } from "@/trpc/routers/_app";
import { inferRouterOutputs } from "@trpc/server";

export type TAgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getONe"];
