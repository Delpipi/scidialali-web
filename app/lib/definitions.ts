export type User = {
  uid: string;
  nom: string;
  prenom: string;
  email: string;
  contact: string;
  profession: string;
  revenu: number;
  role: "administrateur" | "locataire" | "locataire potentiel";
  disabled?: boolean;
  idBienAssocie?: string;
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Estate = {
  id: string;
  adresse: string;
  type: "appartement" | "maison" | "bureau";
  loyerMensuel: number;
  rooms: number;
  available: boolean;
  area: number;
  idGestionnaireAssigne?: string;
  images?: string[];
  documents?: string[];
  createdAt?: string;
  updatedAt?: string;
};
