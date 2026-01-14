import z from "zod";

const userSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),

  nom: z
    .string()
    .min(1, "Le nom est requis")
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères"),

  prenom: z
    .string()
    .min(1, "Le prénom est requis")
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères"),

  password: z
    .string()
    .min(4, "Le mot de passe doit être exactement 4 chiffres.")
    .regex(/^\d{4}$/, "Le mot de passe doit être exactement 4 chiffres."),

  email: z
    .email("L'adresse email n'est pas valide")
    .min(1, "L'email est requis"),

  contact: z
    .string()
    .min(1, "Le contact est requis")
    .regex(/^[0-9+\s\-()]*$/, "Le numéro de contact n'est pas valide")
    .min(10, "Le contact doit contenir au moins 10 caractères"),

  profession: z
    .string()
    .min(1, "La profession est requise")
    .min(2, "La profession doit contenir au moins 2 caractères")
    .max(50, "La profession ne peut pas dépasser 50 caractères"),

  role: z.enum(["administrateur", "locataire", "prospect"]),

  is_active: z.boolean().default(false),

  documents: z
    .array(z.url("Chaque document doit être une URL valide"))
    .default([]),
});

export const createUserSchema = userSchema.omit({
  id: true,
  role: true,
  is_active: true,
  documents: true,
});

export const loginSchema = userSchema.pick({ contact: true, password: true });

export const updatePasswordSchema = userSchema.pick({ password: true });

export const updateUserSchema = userSchema.omit({ password: true });

export type LoginData = z.infer<typeof loginSchema>;

export type UpdatePasswordData = z.infer<typeof createUserSchema>;

export type CreateUserData = z.infer<typeof createUserSchema>;

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

//===================== ESTATE =======================================
export const estateSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  titre: z.string().min(1, "Le titre est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  type: z.enum(["appartement", "maison", "bureau"], {
    message: "Le type doit être appartement, maison ou bureau",
  }),

  loyer_mensuel: z.number().positive("Le loyer mensuel doit être positif"),
  rooms: z
    .number()
    .int()
    .positive("Le nombre de chambres doit être un entier positif"),
  status: z.enum(["0", "1", "2"], {
    message: "Le statut doit être disponible, loué ou reservé",
  }),

  area: z.number().positive("La superficie doit être positive"),
  id_gestionnaire: z.string().optional(),
  images: z.array(z.url("Chaque image doit être une URL valide")).optional(),
  documents: z
    .array(z.url("Chaque document doit être une URL valide"))
    .optional(),
});

export const createEstateSchema = estateSchema.omit({
  id: true,
  id_gestionnaire: true,
  images: true,
  documents: true,
});

export type EstateUpdateData = Omit<z.infer<typeof estateSchema>, "status"> & {
  status: number;
};
export type EstateCreateData = z.infer<typeof createEstateSchema>;
