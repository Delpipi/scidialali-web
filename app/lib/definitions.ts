/********************************
 ************* STATS ************
 ********************************/
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

export type ProspectStats = {
  available_estates: number;
  pending_requests: number;
  reject_rented_estates: number;
};

/********************************
 ************* USERS ************
 ********************************/

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
  role: "admin" | "locataire" | "prospect";
  documents: string[] | [];
  is_active: boolean;
}

export interface PublicUser extends User {
  id: string;
  role: "admin" | "locataire" | "prospect";
  documents: string[];
  is_active: boolean;
  created_at: Date;
  updated_at: Date | null;
}

/****************************
 * ********** ESTATE ********
 ****************************/
export interface Estate {
  titre: string;
  adresse: string;
  type: "appartement" | "maison" | "bureau";
  status: 0 | 1 | 2;
  loyer_mensuel: number;
  rooms: number;
  area: number;
}

export interface CreateEstate extends Estate {
  images: string[] | [];
  documents: string[] | [];
}

export interface UpdateEstate {
  id: string;
  titre?: string | null;
  adresse?: string | null;
  type: "appartement" | "maison" | "bureau";
  status: 0 | 1 | 2;
  loyer_mensuel?: number | null;
  rooms?: number | null;
  area?: number | null;
  images?: string[] | [];
  documents?: string[] | [];
  id_gestionnaire?: string | null;
  id_locataire?: string | null;
}

export interface PublicEstate extends CreateEstate {
  id: string;
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

export interface PaginatedData {
  items: any[];
  total_count: number;
  page: number;
  limit: number;
}

/********************************
 *********** MESSAGE ************
 ********************************/
export enum MessageType {
  INCIDENT = "incident",
  PAYMENT_REMINDER = "payment_reminder",
  DOCUMENT_REQUEST = "document_request",
  GENERAL = "general",
}

export interface PublicMessage {
  id: string;
  subject: string;
  content: string;
  type: MessageType;
  is_read: boolean;
  sender_id: string;
  recipient_id: string;
  parent_id?: string;
  sender?: PublicUser;
  recipient?: PublicUser;
  attachments: string[]; // ✅ CORRECTION: "attachments" pas "documents"
  created_at: string;
}

export interface MessageFormData {
  recipient_id: string;
  subject: string;
  content: string;
  type?: MessageType;
  files?: File[];
}

export type MessageRepliesResponse = {
  items: PublicMessage[];
  total_count: number;
};
