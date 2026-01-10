import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { apiRequest } from "@/app/lib/actions";
import { ApiError, LoginResponse, PublicUser } from "@/app/lib/definitions";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
      async authorize(credentials, req): Promise<User | null> {
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

          const user = await apiRequest<PublicUser>("/api/auth/me", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${result.access_token}`,
            },
          });

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
            } as User;
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
        session.user = token.user as any;
        session.accessToken = (token.user as any).accessToken;
      }

      return session;
    },
  },
});
