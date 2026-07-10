import jwt from "jsonwebtoken";

export type JwtPayload = {
  userId: string;
  email: string;
  provider: "GOOGLE" | "LOCAL";
};

function requireEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, requireEnv("JWT_ACCESS_SECRET"), {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, requireEnv("JWT_REFRESH_SECRET"), {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, requireEnv("JWT_ACCESS_SECRET")) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, requireEnv("JWT_REFRESH_SECRET")) as JwtPayload;
}
