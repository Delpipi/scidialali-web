import { State, createUser } from "../app/lib/actions";

// 1. MOCK OBLIGATOIRE DE NEXT.JS
// Ces lignes DOIVENT être en haut du fichier pour garantir que les
// fonctions originales de Next.js ne sont jamais importées.
jest.mock("next/cache");

// Correction: Nous modifions le mock pour lancer un objet Error standard,
// ce qui est plus fiable pour garantir un rejet de promesse.
jest.mock("next/navigation", () => {
  return {
    // La fonction mockée lance une nouvelle erreur avec l'URL dans le message,
    // garantissant que `rejects.toThrow()` intercepte bien une rejection.
    redirect: jest.fn((url: string) => {
      // Utilisation d'un préfixe unique pour identifier cette erreur dans le test
      throw new Error(`NEXT_REDIRECT_TO:${url}`);
    }),
  };
});

// On importe les mocks pour pouvoir les inspecter
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Assurez-vous d'utiliser la version mockée des fonctions Next.js
// On utilise un simple casting pour accéder aux méthodes de mock après avoir forcé le throw.
const mockRevalidatePath = revalidatePath as unknown as jest.Mock;
const mockRedirect = redirect as unknown as jest.Mock;

// --- Mocks des Dépendances ---
const baseAuthUrl = "http://localhost:8000/auth";

// Mock de fetch global pour simuler les appels API
const mockFetch = jest.fn();
global.fetch = mockFetch;

// État initial pour la fonction
const initialState: State = { message: null, errors: {} };

// Données d'utilisateur valide
const validUserData = {
  nom: "Durand",
  prenom: "Stephane",
  password: "Secret123",
  email: "stephane@test.com",
  contact: "0102030405",
  profession: "Ingenieur",
  revenu: 750000,
};

// Fonction utilitaire pour créer un mock FormData
function createMockFormData(data: Record<string, string | number>): FormData {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    formData.append(key, String(value));
  });
  return formData;
}

// Nettoyage après chaque test
beforeEach(() => {
  jest.clearAllMocks();
});

// --- DÉBUT DES TESTS ---

describe("createUser Server Action", () => {
  // Cas 1 : Validation Zod échoue côté client
  it("devrait retourner une erreur de validation pour les données invalides", async () => {
    const invalidData = { ...validUserData, nom: "A", revenu: "" }; // Nom trop court, revenu vide
    const formData = createMockFormData(invalidData);

    const result = await createUser(initialState, formData);

    expect(result.message).toBe("Veuillez corriger les erreurs de validation.");
    expect(result.errors).toHaveProperty("nom");
  }); // Cas 2 : Succès de la création d'utilisateur

  it("devrait réussir et rediriger en cas de réponse API 200/201", async () => {
    const formData = createMockFormData(validUserData); // Mock de la réponse API 200 (Succès)

    mockFetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ message: "Votre compte a été créé avec succès." }),
    });

    // La fonction `redirect` dans Next.js LÈVE une exception (via notre mock)
    // On vérifie que cette exception est lancée.
    await expect(createUser(initialState, formData)).rejects.toThrow(
      // L'implémentation du mock lève l'Error `NEXT_REDIRECT_TO:/dashboard/users`
      "NEXT_REDIRECT_TO:/dashboard/users"
    ); // Vérification de l'appel API

    expect(mockFetch).toHaveBeenCalledWith(
      `${baseAuthUrl}/signup`,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          nom: validUserData.nom,
          prenom: validUserData.prenom,
          password: validUserData.password,
          email: validUserData.email,
          contact: validUserData.contact,
          profession: validUserData.profession,
          revenu: validUserData.revenu,
        }),
      })
    ); // Vérification des actions post-succès

    expect(mockRevalidatePath).toHaveBeenCalledWith("/dashboard/users");
    expect(mockRedirect).toHaveBeenCalledWith("/dashboard/users");
  }); // Cas 3 : Échec dû à des données non valides côté serveur (422)

  it("devrait retourner les erreurs du serveur en cas de réponse API 422", async () => {
    const formData = createMockFormData(validUserData);
    const serverError = {
      message: "Validation Error",
      errors: { email: "Cet email est déjà utilisé." },
    }; // Mock de la réponse API 422

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 422,
      json: async () => serverError,
      text: async () => JSON.stringify(serverError),
    });

    const result = await createUser(initialState, formData);

    expect(result.message).toBe("Veuillez corriger les erreurs de validation.");
    console.log();
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  }); // Cas 4 : Échec de la requête API (erreur générale 4xx, 5xx, ou réseau)

  it("devrait retourner un message d'échec général en cas de réponse API non-OK (ex: 500)", async () => {
    const formData = createMockFormData(validUserData);
    const errorText = "Internal Server Error"; // Mock de la réponse API 500

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({}), // Peu importe ici
      text: async () => errorText,
    });

    const result = await createUser(initialState, formData);

    expect(result.message).toBe("Echec de l'ajout d'utilisateur");
    expect(result.errors).toEqual({});
    expect(mockRevalidatePath).not.toHaveBeenCalled();
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});
