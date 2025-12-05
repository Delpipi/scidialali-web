"use server";

import {
  createEstateSchema,
  createUserSchema,
  CreateUserSchema,
  EstateCreateData,
  estateSchema,
  EstateUpdateData,
  UpdateUserSchema,
  updateUserSchema,
} from "./schema";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Estate, User } from "./definitions";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const ITEMS_PER_PAGE = 10;

/***********************************************
 ************* ESTATE ACTION *******************
 ***********************************************/

//============== GET ALL ESTATE ================
export async function getAllEstates(currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const res = await fetch(
      `${API_BASE_URL}/estates?limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );

    if (!res.ok) {
      const error = (await res.json())["detail"];
      return { sucess: false, error: error };
    }
    const estates = (await res.json()) as Estate[];
    return { sucess: true, estates: estates };
  } catch (error) {
    console.error("ERREUR GET ALL ESTATE", error);
    return {
      sucess: false,
      error: "Une erreur c'est produite. Merci de réessayer",
    };
  }
}

//================ GET USER ===================
export async function getEstate(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/estates/${id}`);

    if (!res.ok) {
      const error = (await res.json())["detail"];
      return { sucess: false, error: error };
    }

    const user = (await res.json()) as Estate;
    return { sucess: true, user: user };
  } catch (error) {
    console.error("ERREUR GET USER", error);
    return {
      sucess: false,
      error: "Une erreur c'est produite. Merci de réessayer",
    };
  }
}

//============== UPDATE ESTATE ================
export type ErrorEstate = {
  errors?: {
    id?: string[];
    titre?: string[];
    adresse?: string[];
    type?: string[];
    loyerMensuel?: string[];
    rooms?: string[];
    status?: string[];
    area?: string[];
    idGestionnaireAssigne?: string[];
    images?: string[];
    documents?: string[];
  };
  message?: string | null;
};
export async function createEstate(
  prevState: ErrorEstate,
  formData: FormData
): Promise<ErrorEstate> {
  const validateFields = createEstateSchema.safeParse({
    titre: formData.get("titre"),
    adresse: formData.get("adresse"),
    type: formData.get("type"),
    loyerMensuel: Number(formData.get("loyerMensuel")),
    rooms: Number(formData.get("rooms")),
    status: formData.get("status"),
    area: Number(formData.get("area")),
  });

  if (!validateFields.success) {
    console.log(
      "ERRORS VALIDATION:",
      validateFields.error.flatten().fieldErrors
    );
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs de validation.",
    };
  }

  const estateData: EstateCreateData = validateFields.data;

  console.log(`ESTATE DATA ${estateData}`);

  const res = await fetch(`${API_BASE_URL}/estates`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estateData),
  });

  if (res.status === 422) {
    const errorData = await res.json();

    const formattedErrors: Record<string, string[]> = {};

    if (errorData.errors && typeof errorData.errors === "object") {
      Object.entries(errorData.errors).forEach(([fieldName, errorMessage]) => {
        formattedErrors[fieldName] = [String(errorMessage)];
      });
    }

    return {
      errors: formattedErrors,
      message: "Veuillez corriger les erreurs de validation.",
    };
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erreur API:", errorText);

    const error = JSON.parse(errorText);
    return {
      errors: {},
      message: error["detail"],
    };
  }

  revalidatePath("/dashboard/estates");
  redirect("/dashboard/estates");
}

//============== UPDATE ESTATE ================
export async function updateEstate(formData: FormData) {
  console.log("=== START VALIDATION =======");
  try {
    const validateFields = estateSchema.safeParse({
      id: formData.get("id"),
      titre: formData.get("titre"),
      adresse: formData.get("adresse"),
      type: formData.get("type"),
      loyerMensuel: Number(formData.get("loyerMensuel")),
      rooms: Number(formData.get("rooms")),
      status: formData.get("status"),
      area: Number(formData.get("area")),
      idGestionnaireAssigne: formData.get("idGestionnaireAssigne"),
      images: JSON.parse(formData.get("images") as string),
      documents: JSON.parse(formData.get("documents") as string),
    });

    console.log("=== AFTER VALIDATION =======");
    console.error(`VALIDATION STATUS:  ${validateFields.success}`);

    if (!validateFields.success) {
      console.log("ERRORS STATUS:", validateFields.error.flatten().fieldErrors);
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: "Veuillez corriger les erreurs de validation.",
      };
    }

    console.log("=== DEBUT ENVOI =======");

    const estateData: EstateUpdateData = validateFields.data;

    console.log(`ESTATE DATA ${estateData}`);

    const res = await fetch(`${API_BASE_URL}/estates/${estateData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(estateData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error:
          errorData.detail || "Erreur lors de la mise à jour de l'utilisateur",
      };
    }

    const result = await res.json();
    return { success: true, user: result };
  } catch (error) {
    console.error("ERREUR UPDATE USER", error);
    return {
      success: false,
      error: "Une erreur c'est produite. Merci de réessayer",
    };
  }
}

//============== DELETE ESTATE ================
export async function deleteEstate(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/estates/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const error = (await res.json())["detail"];
      throw new Error(error);
    }
    revalidatePath("/dashboard/estates");
  } catch (error) {
    console.error("ERREUR DELETE ESTATE", error);
    throw new Error("Une erreur c'est produite. Merci de réessayer");
  }
}

/***********************************************
 ************* USER ACTION *********************
 ***********************************************/

//=========== GET ALL USER =====================
export async function getAllUsers(currentPage: number) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const res = await fetch(
      `${API_BASE_URL}/users?limit=${ITEMS_PER_PAGE}&offset=${offset}`
    );
    if (!res.ok) {
      const error = (await res.json())["detail"];
      return { sucess: false, error: error };
    }
    const users = (await res.json()) as User[];
    return { sucess: true, users: users };
  } catch (error) {
    console.error("API Error:", error);
    return {
      sucess: false,
      error: "Une erreur c'est produite. Merci de réessayer",
    };
  }
}

//================ CREATE USER ===================
export type State = {
  errors?: {
    nom?: string[];
    prenom?: string[];
    password?: string[];
    email?: string[];
    contact?: string[];
    profession?: string[];
    revenu?: string[];
  };
  message?: string | null;
};

export async function createUser(
  prevState: State,
  formData: FormData
): Promise<State> {
  const validateFields = createUserSchema.safeParse({
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    password: formData.get("prenom"),
    email: formData.get("email"),
    contact: formData.get("contact"),
    profession: formData.get("profession"),
    revenu: formData.get("revenu"),
  });

  if (!validateFields.success) {
    return {
      errors: validateFields.error.flatten().fieldErrors,
      message: "Veuillez corriger les erreurs de validation.",
    };
  }

  const user: CreateUserSchema = validateFields.data;

  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nom: user.nom,
      prenom: user.prenom,
      password: user.password,
      email: user.email,
      contact: user.contact,
      profession: user.profession,
      revenu: user.revenu,
    }),
  });

  if (res.status === 422) {
    const errorData = await res.json();

    // Transformer les erreurs du serveur au format attendu par la vue
    const formattedErrors: Record<string, string[]> = {};

    if (errorData.errors && typeof errorData.errors === "object") {
      Object.entries(errorData.errors).forEach(([fieldName, errorMessage]) => {
        formattedErrors[fieldName] = [String(errorMessage)];
      });
    }

    return {
      errors: formattedErrors,
      message: "Veuillez corriger les erreurs de validation.",
    };
  }

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erreur API:", errorText);

    const error = JSON.parse(errorText);
    return {
      errors: {},
      message: error["detail"],
    };
  }

  revalidatePath("/dashboard/users");
  redirect("/dashboard/users");
}

//================ GET USER ===================
export async function getUser(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`);

    if (!res.ok) {
      const error = (await res.json())["detail"];
      return { sucess: false, error: error };
    }

    const user = (await res.json()) as User;
    return { sucess: true, user: user };
  } catch (error) {
    console.error("ERREUR GET USER", error);
    return {
      sucess: false,
      error: "Une erreur c'est produite. Merci de réessayer",
    };
  }
}

//================ UPDATE USER ===================
export async function updateUser(formData: FormData) {
  try {
    const validateFields = updateUserSchema.safeParse({
      uid: formData.get("uid"),
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      email: formData.get("email"),
      contact: formData.get("contact"),
      profession: formData.get("profession"),
      revenu: Number(formData.get("revenu")),
      role: formData.get("role"),
      disabled: formData.get("disabled") === "on",
      documents: JSON.parse(formData.get("documents") as string),
      idBienAssocie: formData.get("idBienAssocie") as string,
    });

    if (!validateFields.success) {
      return {
        errors: validateFields.error.flatten().fieldErrors,
        message: "Veuillez corriger les erreurs de validation.",
      };
    }

    const userData: UpdateUserSchema = validateFields.data;

    const res = await fetch(`${API_BASE_URL}/users/${userData.uid}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error:
          errorData.detail || "Erreur lors de la mise à jour de l'utilisateur",
      };
    }

    const result = await res.json();
    return { success: true, user: result };
  } catch (error) {
    console.error("ERREUR UPDATE USER", error);
    return {
      success: false,
      error: "Une erreur c'est produite. Merci de réessayer",
    };
  }
}

//============== DELETE ESTATE ================
export async function deleteUser(id: string) {
  try {
    const res = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const error = (await res.json())["detail"];
      throw new Error(error);
    }
    revalidatePath("/dashboard/estates");
  } catch (error) {
    console.error("ERREUR DELETE ESTATE", error);
    throw new Error("Une erreur c'est produite. Merci de réessayer");
  }
}

/***********************************************
 ************* UPLOAD ACTION *******************
 ***********************************************/

//================ UPLOAD DOCUMENT =============
export async function uploadDocument(
  userId: string,
  files: File[],
  folderName: string = "user_documents"
) {
  try {
    if (files.length === 0) {
      return { success: false, error: "Aucun fichier fourni" };
    }

    // Validation des fichiers
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return {
          success: false,
          error: `Type de fichier non autorisé: ${file.name}`,
        };
      }
      if (file.size > maxSize) {
        return {
          success: false,
          error: `Fichier trop volumineux: ${file.name} (max 10MB)`,
        };
      }
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });
    const url = `http://localhost:8000/upload-multiple-files/${userId}/${folderName}`;
    console.log("📤 Upload URL:", url);

    const res = await fetch(
      `http://localhost:8000/upload-multiple-files/${userId}/${folderName}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        error: errorData.detail || "Erreur lors de l'upload des fichiers",
      };
    }

    const result = await res.json();

    // Le backend retourne: { message, urls, count, environment }
    return {
      success: true,
      urls: result.urls || [], // Les URLs des fichiers uploadés
      count: result.count || 0,
      message: result.message || "Fichiers uploadés avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de l'upload des documents:", error);
    return {
      success: false,
      error: "Erreur lors de l'upload des documents",
    };
  }
}

//================ DELETE DOCUMENT =============
export async function deleteDocument(
  userId: string,
  fileUrls: string[],
  folderName: string = "documents"
) {
  try {
    if (fileUrls.length === 0) {
      return { success: false, error: "Aucun fichier à supprimer" };
    }

    const response = await fetch(
      `${API_BASE_URL}/delete-multiple-files/${userId}/${folderName}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_urls: fileUrls,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return {
        success: false,
        error: errorData.detail || "Erreur lors de la suppression des fichiers",
      };
    }

    return {
      success: true,
      message: "Fichiers supprimés avec succès",
    };
  } catch (error) {
    console.error("Erreur lors de la suppression des documents:", error);
    return {
      success: false,
      error: "Erreur lors de la suppression des documents",
    };
  }
}

// Récupérer tous les biens
export async function getAllBiens(): Promise<Estate[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/estates`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch biens: ${response.statusText}`);
    }

    const biens = (await response.json()) as Estate[];
    return biens;
  } catch (error) {
    console.error("Erreur lors de la récupération des biens:", error);
    return [];
  }
}
