export interface User {
  nom: string | null;
  prenom: string | null;
  email: string | null;
  contact: string | null;
  profession: string | null;
}

export interface UserCreate extends User {
  password: string | null;
}

export interface UpdateUser extends User {
  id: string;
  role: "administrateur" | "locataire" | "prospect";
  documents: string[] | [];
  is_active: boolean;
}

export interface PublicUser extends User {
  id: string;
  role: "administrateur" | "locataire" | "prospect";
  documents: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
}

/****************************
 * ********** ESTATE ********
 ****************************/
export interface Estate {
  id: string | null;
  titre: string;
  adresse: string;
  type: "appartement" | "maison" | "bureau";
  status: 0 | 1 | 2;
  loyer_mensuel: number;
  rooms: number;
  area: number;
}

export interface PublicEstate extends Estate {
  images: string[] | [];
  documents: string[] | [];
  id_gestionnaire: string | null;
  id_locataire: string | null;
  created_at: Date;
  updated_at: Date | null;
}

/*****************************
 * ********* UPLOAD **********
 *****************************/
export interface UploadResponse {
  message: string;
  urls: string[];
  count: number;
}

export interface DeleteFileResponse {
  message: string;
  deleted_count: number;
  failed_count: number;
}

export interface LoginCredentials {
  contact: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  access_token: string;
  token_type: string;
}

export class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = "ApiError";
    this.status = status;
    this.detail = detail;
  }
}

export interface ApiResponse {
  message: string;
}

/****************************
 * ********** ESTATE ********
 ****************************/
export interface PublicRentalRequest {
  id: string;
  user_id: string;
  estate_id: string;
  message?: string | null;
  status: 0 | 1 | 2;
  admin_notes?: string | null;
  user?: PublicUser | null;
  estate?: PublicEstate | null;
  created_at: Date;
  updated_at: Date | null;
}
