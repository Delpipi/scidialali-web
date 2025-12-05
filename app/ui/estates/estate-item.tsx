"use client";

import { Estate } from "@/app/lib/definitions";
import Image from "next/image";
import { DeleteEstate, UpdateEstate } from "../users/buttons";
import { groupByThree } from "@/app/lib/utils";
import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useState } from "react";

export default function EStateItem({ estate }: { estate: Estate }) {
  let [isOpen, setIsOpen] = useState(false);
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition fade-in">
      <Image
        src={estate.images?.[0] || "/no-image.jpg"}
        width={250}
        height={200}
        alt={estate.titre}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-bold text-gray-800">{estate.titre}</h3>
          <span
            className={`px-3 py-1 text-xs rounded-full ${
              estate.status === "disponible"
                ? "bg-green-100 text-green-800"
                : estate.status === "loué"
                ? "bg-primary/10 text-primary/80"
                : "bg-orange-100 text-orange-800"
            } `}
          >
            {estate.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4">
          <i className="fas fa-map-marker-alt mr-2"></i>
          {estate.adresse}
        </p>
        <div className="grid grid-cols-3 gap-2 mb-4 text-sm">
          <div className="text-center p-2 bg-gray-50 rounded">
            <i className="fas fa-ruler-combined text-primary/60"></i>
            <p className="text-gray-600 mt-1">{estate.area} m²</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <i className="fas fa-bed text-primary/60"></i>
            <p className="text-gray-600 mt-1">{estate.rooms} ch.</p>
          </div>
          <div className="text-center p-2 bg-gray-50 rounded">
            <i className="fas fa-euro-sign text-primary/60"></i>
            <p className="text-gray-600 mt-1">
              {groupByThree(estate.loyerMensuel)} FCFA
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          {/* <button
            onClick={() => setIsOpen(true)}
            className="flex-1 bg-primary/80 hover:bg-primary text-white text-sm font-semibold py-2 px-4 rounded-lg transition cursor-pointer"
          >
            <i className="fas fa-eye mr-1"></i>Voir
          </button> */}
          <UpdateEstate id={estate.id} />
          <DeleteEstate id={estate.id} />
        </div>
      </div>
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel className="max-w-4xl bg-white rounded-lg overflow-hidden shadow-xl">
            <img
              src={estate.images?.[0] || "/no-image.jpg"}
              alt={estate.titre}
              className="w-full h-96 object-cover"
            />

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <DialogTitle className="text-3xl font-bold text-gray-800 mb-2">
                    {estate.titre}
                  </DialogTitle>
                  <p className="text-gray-600">
                    <i className="fas fa-map-marker-alt mr-2"></i>
                    {estate.adresse}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 text-sm rounded-full ${
                    estate.status === "disponible"
                      ? "bg-green-100 text-green-800"
                      : estate.status === "loué"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                  }`}
                >
                  {estate.status}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <i className="fas fa-ruler-combined text-blue-600 text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Surface</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.area}m²
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <i className="fas fa-bed text-blue-600 text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Chambres</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.rooms}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <i className="fas fa-bath text-blue-600 text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Salle de bain</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.rooms}
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <i className="fas fa-euro-sign text-blue-600 text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Loyer</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.loyerMensuel}€
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  Équipements
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span>Cuisine équipée</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span>Balcon</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span>Parking</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <i className="fas fa-check-circle text-green-600 mr-2"></i>
                    <span>Ascenseur</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                >
                  Fermer
                </button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  );
}
