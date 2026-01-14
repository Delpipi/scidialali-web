"use client";

import { PublicEstate } from "@/app/lib/definitions";
import Image from "next/image";

import { groupByThree } from "@/app/lib/utils";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { LinkButton } from "../button";
import { DeleteEstate } from "../buttons";
import { PencilIcon } from "lucide-react";

export default function EStateItem({ estate }: { estate: PublicEstate }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="bg-white shadow-md overflow-hidden hover:shadow-xl transition fade-in">
      <Image
        src={estate.images?.[0] || "/no-image.jpg"}
        width={250}
        height={200}
        alt={estate.titre}
        className="w-full h-48 object-cover"
      />
      <div className="p-xsmall">
        <div className="flex justify-between items-start mb-xsmall">
          <h3 className="text-lg font-bold text-gray-800">{estate.titre}</h3>
          <span
            className={`px-xsmall py-1 text-xs rounded-full ${
              estate.status === 1
                ? "bg-primary/10 text-primary/80"
                : estate.status === 2
                ? "bg-orange-100 text-orange-800"
                : "bg-green-100 text-green-800"
            } `}
          >
            {(() => {
              switch (estate.status) {
                case 1:
                  return "loué";
                case 2:
                  return "reservé";
                default:
                  return "disponible";
              }
            })()}
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
              {groupByThree(estate.loyer_mensuel)} FCFA
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <LinkButton className="w-full">Louer</LinkButton>
          <LinkButton onClick={() => setIsOpen(true)} variant="outline">
            voir
          </LinkButton>
          {status !== "loading" && session?.user.role === "administrateur" && (
            <>
              <LinkButton
                href={`/admin/estates/${estate.id}/edit`}
                variant="outline"
              >
                <PencilIcon className="w-5" />
              </LinkButton>
              <DeleteEstate id={estate.id as string} />
            </>
          )}
        </div>
      </div>

      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4 bg-black/70">
          <DialogPanel className="max-w-4xl w-full bg-white rounded-md overflow-hidden shadow-xl">
            <img
              src={estate.images?.[selectedImage] || "/no-image.jpg"}
              alt={estate.titre}
              className="w-full h-96 object-cover"
            />

            {/* Galerie de miniatures */}
            {estate.images && estate.images.length > 1 && (
              <div className="px-8 pt-4 pb-2">
                <div className="flex gap-2 overflow-x-auto">
                  {estate.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0  w-20 h-20 rounded-md overflow-hidden border-2 transition ${
                        selectedImage === index
                          ? "border-primary opacity-100"
                          : "border-gray-200 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${estate.titre} - image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

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
                    estate.status === 1
                      ? "bg-primary/10 text-primary/80"
                      : estate.status === 2
                      ? "bg-orange-100 text-orange-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {(() => {
                    switch (estate.status) {
                      case 1:
                        return "loué";
                      case 2:
                        return "reservé";
                      default:
                        return "disponible";
                    }
                  })()}
                </span>
              </div>

              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <i className="fas fa-ruler-combined text-primary text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Surface</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.area}m²
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <i className="fas fa-bed text-primary text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Chambres</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.rooms}
                  </p>
                </div>

                <div className="text-center p-4 bg-gray-50 rounded-md">
                  <i className="fas fa-euro-sign text-primary text-3xl mb-2"></i>
                  <p className="text-gray-600 text-sm">Loyer</p>
                  <p className="font-bold text-gray-800 text-xl">
                    {estate.loyer_mensuel} CFA
                  </p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
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
