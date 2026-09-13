import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { VehicleForm } from '../components/vehicles/VehicleForm';

export const AddVehiclePage: React.FC = () => {
  const navigate = useNavigate();
  const { addVehicle } = useApp();

  const handleCreate = async (data: any) => {
    try {
      await addVehicle({
        plate: data.plate,
        brand: data.brand,
        model: data.model,
        year: data.year,
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        estimatedDelivery: data.estimatedDelivery,
        serviceDescription: data.serviceDescription,
        initialNote: data.initialNote,
      });
      navigate('/vehicles');
    } catch (error) {
      console.error('Error in handleCreate:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Yeni Araç Girişi</h2>
        <p className="text-xs text-slate-500 mt-1">
          Servise kabul edilen aracın detaylarını girin. Müşteri takip bağlantısı ve QR kod otomatik oluşturulacaktır.
        </p>
      </div>

      <VehicleForm onSubmit={handleCreate} isEditing={false} />
    </div>
  );
};
