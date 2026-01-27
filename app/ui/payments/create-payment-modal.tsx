import { PublicEstate } from "@/app/lib/definitions";
import { useState } from "react";

interface CreatePaymentModalProps {
  day: number;
  month: number;
  year: number;
  estates: PublicEstate[];
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

export function CreatePaymentModal({
  day,
  month,
  year,
  estates,
  onClose,
  onSave,
}: CreatePaymentModalProps) {
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    estate_id: "",
    locataire_id: "",
    locataire_nom: "",
    loyer_mensuel: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const dueDate = new Date(year, month - 1, day, 12, 0, 0).toISOString();

    const payload = {
      locataire_id: formValues.locataire_id,
      estate_id: formValues.estate_id,
      loyer_mensuel: formValues.loyer_mensuel,
      due_date: dueDate,
    };

    await onSave(payload);
    setLoading(false);
  };

  const handleSeletedRentedEstate = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    const estateId = e.target.value;

    const selectedEState = estates.find((es) => es.id === estateId);
    if (selectedEState) {
      setFormValues({
        estate_id: selectedEState.id,
        locataire_id: selectedEState.locataire!.id,
        locataire_nom: `${selectedEState.locataire!.nom!} ${selectedEState.locataire!.prenom!}`,
        loyer_mensuel: selectedEState.loyer_mensuel.toString(),
      });
    } else {
      setFormValues({
        estate_id: "",
        locataire_id: "",
        locataire_nom: "",
        loyer_mensuel: "",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-xl font-bold mb-4">
          Nouveau paiement pour le {day}/{month}/{year}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Bien Immobilier
            </label>
            <select
              name="estate_id"
              required
              className="w-full border rounded-md p-2 bg-gray-50"
              onChange={handleSeletedRentedEstate}
            >
              <option value="">Sélectionner un bien</option>
              {estates.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.titre}
                </option>
              ))}
            </select>
          </div>

          <input
            type="hidden"
            name="locataire_id"
            defaultValue={formValues.locataire_id}
          />

          <div>
            <label className="block text-sm font-medium mb-1">Locataire</label>
            <input
              type="text"
              name="locataire_nom"
              required
              defaultValue={formValues.locataire_nom}
              placeholder="Nom et Prenom du locataire"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Montant du loyer (FCFA)
            </label>
            <input
              type="number"
              name="loyerMensuel"
              required
              defaultValue={formValues.loyer_mensuel}
              placeholder="Ex: 150000"
              className="w-full border rounded-md p-2"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-md disabled:opacity-50"
            >
              {loading ? "Création..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
