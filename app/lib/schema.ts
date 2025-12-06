import z from "zod";

const userSchema = z.object({
  uid: z.string().min(1, "L'ID est requis"),

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
    .min(6, "Le mot de passe doit contenir au moins 6 caractères") // La longueur minimale est de 6
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule") // Doit contenir au moins une majuscule
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre")
    .regex(
      /[^A-Za-z0-9]/,
      "Le mot de passe doit contenir au moins un caractère spécial"
    ),

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

  role: z.enum(["administrateur", "locataire", "locataire potentiel"]),

  revenu: z.coerce
    .number("Le revenu doit être un nombre.")
    .int("Le revenu doit être un entier.")
    .min(0, "Le revenu ne peut pas être négatif.")
    .max(999999999, "Le revenu est trop élevé.")
    .default(0),

  disabled: z.boolean().default(false),

  idBienAssocie: z
    .string()
    .min(1, "L'ID du bien associé est requis")
    .nullable(),

  documents: z
    .array(z.url("Chaque document doit être une URL valide"))
    .default([]),
});

export const createUserSchema = userSchema.omit({
  uid: true,
  disabled: true,
  idBienAssocie: true,
  role: true,
});

export const updateUserSchema = userSchema.omit({ password: true });

export type CreateUserSchema = z.infer<typeof createUserSchema>;

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;

//===================== ESTATE =======================================
export const estateSchema = z.object({
  id: z.string().min(1, "L'ID est requis"),
  titre: z.string().min(1, "Le titre est requis"),
  adresse: z.string().min(1, "L'adresse est requise"),
  type: z.enum(["appartement", "maison", "bureau"], {
    message: "Le type doit être appartement, maison ou bureau",
  }),

  loyerMensuel: z.number().positive("Le loyer mensuel doit être positif"),
  rooms: z
    .number()
    .int()
    .positive("Le nombre de chambres doit être un entier positif"),
  status: z.enum(["disponible", "loué", "reservé"], {
    message: "Le statut doit être disponible, loué ou reservé",
  }),

  area: z.number().positive("La superficie doit être positive"),
  idGestionnaireAssigne: z.string().optional(),
  images: z.array(z.url("Chaque image doit être une URL valide")).optional(),
  documents: z
    .array(z.url("Chaque document doit être une URL valide"))
    .optional(),
});

export const createEstateSchema = estateSchema.omit({
  id: true,
  idGestionnaireAssigne: true,
  images: true,
  documents: true,
});

export type EstateUpdateData = z.infer<typeof estateSchema>;
export type EstateCreateData = z.infer<typeof createEstateSchema>;
