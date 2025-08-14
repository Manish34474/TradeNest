import { CorsOptions } from "cors";
import { allowedOrigins } from "./allowedOrigins.config";

export const corsOption: CorsOptions = {
  origin: (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void
  ) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not Allowed By CORS"));
    }
  },
  optionsSuccessStatus: 200,
};
