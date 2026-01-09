export interface User {
  id: string | null;
  nom: string | null;
  prenom: string | null;
  email: string | null;
  contact: string | null;
  profession: string | null;
}

export interface UserCreate extends User {
  password: string | null;
}

export interface PublicUser extends User {
  role: "administrateur" | "locataire" | "prospect";
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

export interface ApiError {
  detail: string;
  status: number;
}

export interface ApiResponse {
  message: string;
}
