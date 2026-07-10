import passport from "passport";
import { Strategy as GoogleStrategy, type Profile } from "passport-google-oauth20";
import fs from "node:fs";
import path from "node:path";
import { findUserByGoogleId, findUserByEmail, createGoogleUser } from "../repositories/user.repository.js";
import { signAccessToken, signRefreshToken } from "../utils/jwt.js";

interface GoogleOAuthConfig {
  web: {
    client_id: string;
    client_secret: string;
    redirect_uris: string[];
  };
}

const CONFIG_PATH = path.resolve(process.cwd(), "google-oauth.json");

function loadGoogleConfig(): GoogleOAuthConfig["web"] {

  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`google-oauth.json not found at ${CONFIG_PATH}`);
  }
  const raw = fs.readFileSync(CONFIG_PATH, "utf-8");
  const parsed = JSON.parse(raw) as GoogleOAuthConfig;
  if (!parsed.web?.client_id || !parsed.web?.client_secret) {
    throw new Error("Invalid google-oauth.json: missing client_id or client_secret");
  }
  return parsed.web;
}

const getGoogleConfig = (): GoogleOAuthConfig["web"] => {
  return loadGoogleConfig();
};

passport.use(
  new GoogleStrategy(
    (() => {
      const googleConfig = loadGoogleConfig();
      return {
        clientID: googleConfig.client_id,
        clientSecret: googleConfig.client_secret,
        callbackURL:
          googleConfig.redirect_uris[0] || "http://localhost:5000/api/auth/google/callback",
        scope: ["profile", "email"],
      };
    })(),
    async (


      _accessToken: string,
      _refreshToken: string,
      profile: Profile,
      done: (error: unknown, user?: unknown) => void
    ) => {
      try {
        const email = profile.emails?.[0]?.value;
        const googleId = profile.id;
        const name = profile.displayName || email?.split("@")[0] || "Google User";

        if (!email || !googleId) {
          return done(new Error("Google profile missing email or id"));
        }

        let user = await findUserByGoogleId(googleId);

        if (!user) {
          const existing = await findUserByEmail(email);
          if (existing) {
            // Link Google to existing LOCAL account is intentionally skipped to avoid duplicates.
            return done(new Error("Account exists with this email. Please log in with email/password."));
          }
          user = await createGoogleUser({
            name,
            email,
            googleId,
            avatarUrl: profile.photos?.[0]?.value ?? null,
          });
        }

        const accessToken = signAccessToken({
          userId: user.id,
          email: user.email,
          provider: "GOOGLE",
        });
        const refreshToken = signRefreshToken({
          userId: user.id,
          email: user.email,
          provider: "GOOGLE",
        });

        return done(null, { user, accessToken, refreshToken });
      } catch (err) {
        if (err instanceof Error) {
          return done(err);
        }
        return done(new Error("Google OAuth handler failed"));
      }
    }
  )
);

export default passport;
