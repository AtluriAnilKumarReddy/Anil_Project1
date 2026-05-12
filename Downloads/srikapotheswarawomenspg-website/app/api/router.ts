import { createRouter, publicQuery } from "./middleware";
import { hostelRouter } from "./routers/hostel";
import { roomRouter } from "./routers/room";
import { bedRouter } from "./routers/bed";
import { studentRouter } from "./routers/student";
import { paymentRouter } from "./routers/payment";
import { authRouter } from "./routers/auth";
import { seedRouter } from "./routers/seed";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  hostel: hostelRouter,
  room: roomRouter,
  bed: bedRouter,
  student: studentRouter,
  payment: paymentRouter,
  auth: authRouter,
  seed: seedRouter,
});

export type AppRouter = typeof appRouter;
