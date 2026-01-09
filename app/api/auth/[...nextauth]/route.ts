import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiRequest } from "@/app/lib/actions";
import { getCurrentUser } from "@/app/lib/auth";
import { ApiError, LoginResponse } from "@/app/lib/definitions";

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        contact: {
          label: "contact",
          type: "tel",
          placeholder: "+225 XX XX XX XX",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "***********",
        },
      },
      async authorize(credentials) {
        if (!credentials?.contact || !credentials?.password) {
          return null;
        }

        try {
          const result = await apiRequest<LoginResponse>("/api/auth/signin", {
            method: "POST",
            body: JSON.stringify({
              contact: credentials.contact,
              password: credentials.password,
            }),
          });

          const user = await getCurrentUser();

          if (result && user) {
            return {
              id: user.id,
              nom: user.nom,
              prenom: user.prenom,
              email: user.email,
              contact: user.contact,
              profession: user.profession,
              role: user.role,
              is_active: user.is_active,
              accessToken: result.access_token,
            };
          }

          return null;
        } catch (error) {
          console.error("Erreur d'authentification:", error);
          const apiError = error as ApiError;
          throw Error(apiError.detail || "Erreur lors de l'authentification");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user = token.user;
        session.accessToken = token.user.accessToken;
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
