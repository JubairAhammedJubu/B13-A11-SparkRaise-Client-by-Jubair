import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";
// import { admin } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
// const db = client.db(process.env.MONGODB_URI);
const db = client.db("crowdfunding");

// Starting credits granted once at registration (per doc requirement)
const STARTING_CREDITS = {
  supporter: 50,
  creator: 20,
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET,

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  database: mongodbAdapter(db, { client }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "supporter",
        required: false,
        input: true,
      },
      credits: {
        type: "number",
        default: 0,
        required: false,
        input: false,
      },
      raised_credits: {
        type: "number",
        default: 0,
        required: false,
        input: false,
      },
    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Supporter dropdown value comes through as "supporter" or "creator" (see doc's registration form)
          const role = user.role === "creator" ? "creator" : "supporter";
          return {
            data: {
              ...user,
              role,
              // Starting credits are granted exactly once, here, at account creation —
              // never re-applied on subsequent logins/updates.
              credits: STARTING_CREDITS[role] ?? 0,
              raised_credits: 0,
            },
          };
        },
      },
    },
  },

  session: {
    cookieName: "token",
    cookieCache: {
      enabled: true,
      strategy: "jwt",
      maxAge: 30 * 24 * 60 * 60
    },
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: '7d',
      },
      schema: {
        jwks: {
          tableName: 'jwks',
        },
      },
    })
  ],
  /* plugins: [
    admin(),
  ] */
});

