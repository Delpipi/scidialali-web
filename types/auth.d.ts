import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      nom: string;
      prenom: string;
      email: string;
      contact: string;
      profession: string;
      role: "admin" | "locataire" | "prospect";
      is_active: boolean;
    };
  }

  interface User {
    id: string;
    nom: string;
    prenom: string;
    email: string;
    contact: string;
    profession: string;
    role: string;
    is_active: boolean;
    accessToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: any;
  }
}
