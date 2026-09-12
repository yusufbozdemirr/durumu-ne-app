import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VehicleForm } from '../components/vehicles/VehicleForm';

export const EditVehiclePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getVehicleById, updateVehicle } = useApp();

  const vehicle = id ? getVehicleById(id) : undefined;

  if (!vehicle) {
    return (
      <div className="bg-[#0c152a] rounded-2xl border border-slate-800 p-8 text-center max-w-md mx-auto my-12 shadow-xl">
        <h3 className="text-base font-bold text-white">Araç Bulunamadı</h3>
        <p className="text-xs text-slate-400 mt-1 mb-4">
          Düzenlemek istediğiniz araç kaydı bulunamadı veya silinmiş olabilir.
        </p>
        <button
          onClick={() => navigate('/vehicles')}
          className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors cursor-pointer"
        >
          Araçlara Dön
        </button>
      </div>
    );
  }

  const handleUpdate = async (data: any) => {
    await updateVehicle(vehicle.id, {
      plate: data.plate,
      brand: data.brand,
      model: data.model,
      year: data.year,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      estimatedDelivery: data.estimatedDelivery,
      serviceDescription: data.serviceDescription,
    });
    navigate(`/vehicles/${vehicle.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white tracking-tight">Araç Bilgilerini Düzenle</h2>
        <p className="text-xs text-slate-400 mt-1">
          {vehicle.plate} - {vehicle.brand} {vehicle.model}
        </p>
      </div>

      <VehicleForm initialData={vehicle} onSubmit={handleUpdate} isEditing={true} />
    </div>
  );
};
