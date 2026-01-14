"use server";

import {
  createEstateSchema,
  CreateUserData,
  createUserSchema,
  EstateCreateData,
  estateSchema,
  EstateUpdateData,
  loginSchema,
  updatePasswordSchema,
  UpdateUserSchema,
  updateUserSchema,
} from "./schema";

import {
  ApiError,
  ApiResponse,
  DeleteFileResponse,
  PublicEstate,
  PublicRentalRequest,
  PublicUser,
  UploadResponse,
} from "./definitions";
import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:8000";
const ITEMS_PER_PAGE = 10;

/**************************************
 ************* TYPES STATE ************
 **************************************/
export type AdminStats = {
  total_users: number;
  active_tenants: number;
  available_estates: number;
  rented_estates: number;
  pending_requests: number;
  unread_messages: number;
  pending_payments: number;
  late_payments: number;
};

export type UserState = {
  status: "idle" | "success" | "error";
  message?: string;
  data?: any;
  fieldErrors?: {
    nom?: string[];
    prenom?: string[];
    password?: string[];
    email?: string[];
    contact?: string[];
    profession?: string[];
    role?: string[];
    is_active?: string[];
    documents?: string[];
  };
  httpStatus?: number;
};

export type EstateState = {
  status: "idle" | "success" | "error";
  message?: string;
  data?: any;
  fieldErrors?: {
    id?: string[];
    titre?: string[];
    adresse?: string[];
    type?: string[];
    loyer_mensuel?: string[];
    rooms?: string[];
    status?: string[];
    area?: string[];
    id_gestionnaire?: string[];
    id_locataire?: string[];
    images?: string[];
    documents?: string[];
  };
  httpStatus?: number;
};

export type AuthState = {
  status: "idle" | "success" | "error";
  message?: string;
  data?: any;
  fieldErrors?: {
    contact?: string[];
    password?: string[];
  };
  httpStatus?: number;
};

export type UpdatePasswordState = {
  status: "idle" | "success" | "error";
  message?: string;
  data?: any;
  fieldErrors?: {
    oldPassword?: string[];
    newPassword?: string[];
  };
  httpStatus?: number;
};

export async function handleUnauthorized() {
  // This clears the Auth.js session
  await signOut({ redirect: false });
  redirect("/login");
}

/**************************************
 ************* API REQUEST ************
 **************************************/
export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await auth();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`,
    }),
    ...options.headers,
    credentials: "include",
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers,
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(response.status, errorData.detail);
  }

  const data = await response.json();
  return data;
}

async function apiUpload<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const session = await auth();

  const headers: HeadersInit = {
    ...(session?.accessToken && {
      Authorization: `Bearer ${session.accessToken}`,
    }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new ApiError(response.status, errorData.detail);
  }

  const data = await response.json();
  return data;
}

/**************************************
 ************* STATS *******************
 **************************************/
export async function getAdminStats() {
  const result = await apiRequest<AdminStats>("/api/stats/admin", {
    method: "GET",
  });
  return result;
}

/**************************************
 ************* AUTH *******************
 **************************************/

export async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const validateFields = loginSchema.safeParse({
    contact: formData.get("contact"),
    password: formData.get("password"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs de validations.",
      fieldErrors: validateFields.error.flatten().fieldErrors,
    };
  }

  const callbackUrl = formData.get("callbackUrl");

  try {
    const result = await signIn("credentials", {
      contact: validateFields.data.contact,
      password: validateFields.data.password,
      redirectTo: callbackUrl as string,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message: error.cause?.err?.message,
      };
    }
    throw error;
  }

  return { status: "success", message: "Connecté !" };
}

//UPDATE PASSWORD
export async function updatePassword(oldPassword: string, newPassword: string) {
  const validateOldPasswordField = updatePasswordSchema.safeParse({
    password: oldPassword,
  });
  const validateNewPasswordField = updatePasswordSchema.safeParse({
    password: newPassword,
  });

  if (!validateOldPasswordField.success || !validateNewPasswordField.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs de validation.",
      fieldErrors: {
        oldPassword:
          validateOldPasswordField.error?.flatten().fieldErrors.password,
        newPassword:
          validateNewPasswordField.error?.flatten().fieldErrors.password,
      },
    };
  }

  const data = {
    old_password: validateOldPasswordField.data.password,
    new_password: validateNewPasswordField.data.password,
  };

  try {
    const result = await apiRequest<ApiResponse>("/api/auth/update_password", {
      method: "PUT",
      body: JSON.stringify(data),
    });

    return {
      status: "success",
      message: result.message,
      data: result,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue.",
      httpStatus: apiError.status,
    };
  }
}

//REGISTER USER
export async function register(
  prevState: UserState,
  formData: FormData
): Promise<UserState> {
  const validateFields = createUserSchema.safeParse({
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    password: formData.get("password"),
    email: formData.get("email"),
    contact: formData.get("contact"),
    profession: formData.get("profession"),
  });

  if (!validateFields.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs de validation.",
      fieldErrors: validateFields.error.flatten().fieldErrors,
    };
  }

  const userData: CreateUserData = validateFields.data;

  try {
    const result = await apiRequest<ApiResponse>("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });

    return {
      status: "success",
      message: result.message,
      data: result,
    };
  } catch (error) {
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue.",
      httpStatus: apiError.status,
    };
  }
}

/***********************************************
 ************* ESTATE ACTION *******************
 ***********************************************/

//============== GET ALL ESTATE ================
export async function getAllAvailableEstates({
  type,
  order_by,
  currentPage = 1,
}: {
  type?: string;
  order_by: string;
  currentPage?: number;
}) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    const estates = await apiRequest<PublicEstate[]>(
      `/api/estates/available?&type=${type}&limit=${ITEMS_PER_PAGE}&offset=${offset}&order_by=${order_by}`,
      { method: "GET" }
    );

    return {
      status: "success",
      data: estates,
    };
  } catch (error) {
    console.error("ERREUR GET ALL AVAILABLE ESTATE", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue.",
      httpStatus: apiError.status,
    };
  }
}

export async function getAllEstates({
  status,
  type,
  order_by,
  currentPage = 1,
}: {
  status?: number;
  type?: string;
  order_by: string;
  currentPage?: number;
}) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  try {
    let url = `/api/estates?type=${type}&limit=${ITEMS_PER_PAGE}&offset=${offset}&order_by=${order_by}`;
    if (status !== undefined) {
      url += `&status=${status}`;
    }

    const estates = await apiRequest<PublicEstate[]>(url);

    return {
      status: "success",
      data: estates,
    };
  } catch (error) {
    console.error("ERREUR GET ALL ESTATE", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue.",
      httpStatus: apiError.status,
    };
  }
}

//GET ESTATE
export async function getEstate(id: string) {
  try {
    const estate = await apiRequest<PublicEstate>(`/api/estates/${id}`, {
      method: "GET",
    });

    return {
      status: "success",
      data: estate,
    };
  } catch (error) {
    console.error("ERREUR GET ESTATE", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue",
      httpStatus: apiError.status,
    };
  }
}

// CREATE ESTATE
export async function createEstate(
  prevState: EstateState,
  formData: FormData
): Promise<EstateState> {
  const validateFields = createEstateSchema.safeParse({
    titre: formData.get("titre"),
    adresse: formData.get("adresse"),
    type: formData.get("type"),
    loyer_mensuel: Number(formData.get("loyer_mensuel")),
    rooms: Number(formData.get("rooms")),
    status: formData.get("status"),
    area: Number(formData.get("area")),
  });

  if (!validateFields.success) {
    console.error(validateFields.error.flatten().fieldErrors);
    return {
      status: "error",
      message: "Veuillez corriger les erreurs de validation.",
      fieldErrors: validateFields.error.flatten().fieldErrors,
    };
  }

  const estateData: EstateCreateData = validateFields.data;

  try {
    const result = await apiRequest<ApiResponse>("/api/estates", {
      method: "POST",
      body: JSON.stringify(estateData),
    });
  } catch (error) {
    console.error("ERREUR CREATE ESTATE", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue",
      httpStatus: apiError.status,
    };
  }

  revalidatePath("/admin/estates");
  redirect("/admin/estates");
}

//UPDATE ESTATE
export async function updateEstate(formData: FormData) {
  try {
    const validateFields = estateSchema.safeParse({
      id: formData.get("id"),
      titre: formData.get("titre"),
      adresse: formData.get("adresse"),
      type: formData.get("type"),
      loyer_mensuel: Number(formData.get("loyer_mensuel")),
      rooms: Number(formData.get("rooms")),
      status: formData.get("status"),
      area: Number(formData.get("area")),
      id_gestionnaire: formData.get("id_gestionnaire"),
      id_locataire: formData.get("id_locataire"),
      images: JSON.parse(formData.get("images") as string),
      documents: JSON.parse(formData.get("documents") as string),
    });

    if (!validateFields.success) {
      return {
        status: "error",
        message: "Veuillez corriger les erreurs de validation.",
        fieldErrors: validateFields.error.flatten().fieldErrors,
      };
    }

    const estateData: EstateUpdateData = {
      ...validateFields.data,
      status: parseInt(validateFields.data.status, 10), // convert string to number
    };

    const result = await apiRequest<ApiResponse>(
      `/api/estates/${estateData.id}`,
      { method: "PUT", body: JSON.stringify(estateData) }
    );

    return {
      status: "success",
      message: result.message,
      data: result,
    };
  } catch (error) {
    console.error("ERREUR UPDATE ESTATE", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue",
      httpStatus: apiError.status,
    };
  }
}

// DELETE ESTATE
export async function deleteEstate(id: string) {
  try {
    const result = await apiRequest<ApiResponse>(`/api/estates/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("ERREUR DELETE ESTATE", error);
    const apiError = error as ApiError;
    throw apiError;
  }
}

/***********************************************
 ************* USER ACTION *********************
 ***********************************************/

//GET ALL USER
export async function getAllUsers({
  role,
  order_by,
  currentPage,
}: {
  role?: string;
  order_by: string;
  currentPage: number;
}) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  let url = `/api/users?limit=${ITEMS_PER_PAGE}&offset=${offset}&order_by=${order_by}`;
  if (role !== undefined) {
    url += `&role=${role}`;
  }
  const users = await apiRequest<PublicUser[]>(url);
  return users;
}

//GET USER
export async function getUser(id: string) {
  const user = await apiRequest<PublicUser>(`/api/users/${id}`, {
    method: "GET",
  });
  console.log(user);
  return user;
}

//================ UPDATE USER ===================
export async function updateUser(formData: FormData) {
  try {
    const validateFields = updateUserSchema.safeParse({
      id: formData.get("id"),
      nom: formData.get("nom"),
      prenom: formData.get("prenom"),
      email: formData.get("email"),
      contact: formData.get("contact"),
      profession: formData.get("profession"),
      role: formData.get("role"),
      is_active: !Boolean(formData.get("is_active")),
      documents: JSON.parse(formData.get("documents") as string),
    });

    if (!validateFields.success) {
      console.error(validateFields.error.flatten().fieldErrors);
      return {
        status: "error",
        message: "Veuillez corriger les erreurs de validation.",
        fieldErrors: validateFields.error.flatten().fieldErrors,
      };
    }

    const userData: UpdateUserSchema = validateFields.data;

    const result = await apiRequest<ApiResponse>(`/api/users/${userData.id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });

    return {
      status: "success",
      message: result.message,
      data: result,
    };
  } catch (error) {
    console.error("ERREUR UPDATE USER", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Une erreur est survenue",
      httpStatus: apiError.status,
    };
  }
}

//============== DELETE USER ================
export async function deleteUser(id: string) {
  try {
    const result = await apiRequest<ApiResponse>(`/api/users/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("ERREUR DELETE USER", error);
    const apiError = error as ApiError;
    throw apiError;
  }
}

/***********************************************
 ************* UPLOAD ACTION *******************
 ***********************************************/

//================ UPLOAD DOCUMENT =============
export async function uploadDocument(
  id: string,
  files: File[],
  folderName: string
) {
  try {
    if (files.length === 0) {
      return {
        status: "error",
        message: "Aucun fichier fourni",
      };
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "text/plain",
    ];
    const maxSize = 10 * 1024 * 1024;

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        return {
          status: "error",
          message: `Type de fichier non autorisé: ${file.name}`,
        };
      }
      if (file.size > maxSize) {
        return {
          status: "error",
          message: `Fichier trop volumineux: ${file.name} (max 10MB)`,
        };
      }
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await apiUpload<UploadResponse>(
      `/api/upload-multiple-files/${id}/${folderName}`,
      {
        method: "POST",
        body: formData,
      }
    );

    return {
      status: "success",
      message: response.message,
      data: {
        urls: response.urls || [],
        count: response.count || 0,
      },
    };
  } catch (error) {
    console.error("Erreur lors de l'upload des documents:", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Erreur lors de l'upload des fichiers",
      httpStatus: apiError.status,
    };
  }
}

//================ DELETE DOCUMENT =============
export async function deleteDocument(
  id: string,
  fileUrls: string[],
  folderName: string
) {
  try {
    if (fileUrls.length === 0) {
      return {
        status: "error",
        message: "Aucun fichier à supprimer",
      };
    }

    const response = await apiRequest<DeleteFileResponse>(
      `/api/delete-multiple-files/${id}/${folderName}`,
      {
        method: "POST",
        body: JSON.stringify({
          file_urls: fileUrls,
        }),
      }
    );

    return {
      status: "success",
      message: response.message,
      data: {
        deleted_count: response.deleted_count,
        failed_count: response.failed_count,
      },
    };
  } catch (error) {
    console.error("Erreur lors de la suppression des documents:", error);
    const apiError = error as ApiError;
    return {
      status: "error",
      message: apiError.detail || "Erreur lors de la suppression des fichiers",
      httpStatus: apiError.status,
    };
  }
}

/***********************************************
 ************* RENTAL REQUEST ACTION ***********
 ***********************************************/

export async function getAllRentalRequest({
  status,
  order_by,
  currentPage = 1,
}: {
  status?: number;
  order_by: string;
  currentPage?: number;
}) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  let url = `/api/rental_requests/?limit=${ITEMS_PER_PAGE}&offset=${offset}&order_by=${order_by}`;
  if (status !== undefined) {
    url += `&status=${status}`;
  }
  const rental_requests = await apiRequest<PublicRentalRequest[]>(url);
  return rental_requests;
}

export async function getRentalRequestById(id: string) {
  const result = await apiRequest<PublicRentalRequest>(
    `/api/rental_requests/${id}`,
    {
      method: "GET",
    }
  );
  return result;
}

export async function approveRentalRequest(id: string, admin_notes: string) {
  const result = await apiRequest(`/api/rental_requests/${id}/approve`, {
    method: "PATCH",
    body: JSON.stringify({ admin_notes: admin_notes }),
  });
  return result;
}

export async function rejectedRentalRequest(id: string) {
  const message = await apiRequest(`/api/rental_requests/${id}/reject`, {
    method: "PATCH",
  });
  return message;
}

export async function deleteRentalRequest(id: string) {
  const message = await apiRequest<void>(`/api/rental_requests/${id}`, {
    method: "DELETE",
  });
  return message;
}
