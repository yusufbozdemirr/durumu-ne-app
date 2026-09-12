/**
 * Türkiye'de en çok kullanılan araç markaları, modelleri ve motor seçenekleri
 */

export interface CarBrandData {
  brand: string;
  models: {
    name: string;
    engines: string[];
  }[];
}

export const POPULAR_CAR_DATABASE: CarBrandData[] = [
  {
    brand: 'Fiat',
    models: [
      { name: 'Egea Sedan', engines: ['1.3 Multijet', '1.4 Fire', '1.6 Multijet', '1.5 T4 Hibrit'] },
      { name: 'Egea Cross', engines: ['1.3 Multijet', '1.4 Fire', '1.6 Multijet', '1.5 T4 Hibrit'] },
      { name: 'Egea Hatchback', engines: ['1.3 Multijet', '1.4 Fire', '1.6 Multijet'] },
      { name: 'Fiorino', engines: ['1.3 Multijet', '1.4 Eko (LPG)'] },
      { name: 'Doblo', engines: ['1.3 Multijet', '1.6 Multijet', '1.5 BlueHDi', '2.0 Multijet'] },
      { name: 'Linea', engines: ['1.3 Multijet', '1.4 Fire', '1.6 Multijet'] },
      { name: 'Punto', engines: ['1.3 Multijet', '1.2 Fire', '1.4 Fire'] },
      { name: 'Panda', engines: ['1.0 Hibrit', '1.2 Fire'] },
      { name: 'Ducato', engines: ['2.2 Multijet', '2.3 Multijet'] },
    ],
  },
  {
    brand: 'Renault',
    models: [
      { name: 'Clio', engines: ['1.0 TCe', '1.0 SCe', '0.9 TCe', '1.5 dCi', '1.2 16V'] },
      { name: 'Megane Sedan', engines: ['1.5 dCi', '1.3 TCe', '1.6 16V'] },
      { name: 'Megane Hatchback', engines: ['1.5 dCi', '1.3 TCe'] },
      { name: 'Symbol', engines: ['1.5 dCi', '1.2 16V', '0.9 TCe'] },
      { name: 'Fluence', engines: ['1.5 dCi', '1.6 16V'] },
      { name: 'Austral', engines: ['1.3 Mild Hybrid', 'E-Tech Full Hybrid'] },
      { name: 'Captur', engines: ['1.0 TCe', '1.3 TCe', '1.5 dCi'] },
      { name: 'Kadjar', engines: ['1.5 dCi', '1.3 TCe', '1.2 TCe'] },
      { name: 'Kangoo', engines: ['1.5 dCi'] },
      { name: 'Trafic', engines: ['2.0 dCi', '1.6 dCi'] },
      { name: 'Master', engines: ['2.3 dCi'] },
      { name: 'Talisman', engines: ['1.6 dCi', '2.0 dCi'] },
    ],
  },
  {
    brand: 'Volkswagen',
    models: [
      { name: 'Passat', engines: ['1.5 TSI', '1.6 TDI', '2.0 TDI', '1.4 TSI'] },
      { name: 'Passat Variant', engines: ['1.5 TSI', '2.0 TDI'] },
      { name: 'Golf', engines: ['1.0 TSI', '1.5 TSI eTSI', '1.6 TDI', '1.4 TSI', '1.2 TSI'] },
      { name: 'Polo', engines: ['1.0 TSI', '1.0 EVO', '1.2 TSI', '1.4 TDI', '1.6 TDI'] },
      { name: 'Caddy', engines: ['2.0 TDI', '1.6 TDI', '1.9 TDI', '1.5 TSI'] },
      { name: 'Tiguan', engines: ['1.5 TSI', '2.0 TDI', '1.4 TSI'] },
      { name: 'T-Roc', engines: ['1.5 TSI'] },
      { name: 'Taigo', engines: ['1.0 TSI', '1.5 TSI'] },
      { name: 'Jetta', engines: ['1.6 TDI', '1.2 TSI', '1.4 TSI'] },
      { name: 'Transporter', engines: ['2.0 TDI'] },
      { name: 'Crafter', engines: ['2.0 TDI'] },
      { name: 'Amarok', engines: ['2.0 TDI', '3.0 V6 TDI'] },
      { name: 'Arteon', engines: ['2.0 TDI', '1.5 TSI'] },
    ],
  },
  {
    brand: 'Ford',
    models: [
      { name: 'Focus Sedan', engines: ['1.5 EcoBlue', '1.6 Ti-VCT', '1.6 TDCi', '1.0 EcoBoost'] },
      { name: 'Focus Hatchback', engines: ['1.5 EcoBlue', '1.0 EcoBoost', '1.6 TDCi'] },
      { name: 'Tourneo Courier', engines: ['1.5 TDCi', '1.6 TDCi', '1.0 EcoBoost'] },
      { name: 'Tourneo Custom', engines: ['2.0 EcoBlue'] },
      { name: 'Transit', engines: ['2.0 EcoBlue', '2.2 TDCi'] },
      { name: 'Fiesta', engines: ['1.0 EcoBoost', '1.4 TDCi', '1.5 TDCi', '1.25'] },
      { name: 'Puma', engines: ['1.0 EcoBoost Hibrit'] },
      { name: 'Kuga', engines: ['1.5 EcoBoost', '1.5 TDCi', '2.0 TDCi'] },
      { name: 'Mondeo', engines: ['1.6 TDCi', '2.0 TDCi', '1.5 EcoBoost'] },
      { name: 'Ranger', engines: ['2.0 EcoBlue', '2.2 TDCi', '3.2 TDCi'] },
    ],
  },
  {
    brand: 'Toyota',
    models: [
      { name: 'Corolla Sedan', engines: ['1.5 Dynamic Force', '1.8 Hybrid', '1.6 Valvematic', '1.4 D-4D'] },
      { name: 'Corolla Cross', engines: ['1.8 Hybrid'] },
      { name: 'Yaris', engines: ['1.0', '1.5', '1.5 Hybrid'] },
      { name: 'Yaris Cross', engines: ['1.5 Hybrid'] },
      { name: 'C-HR', engines: ['1.8 Hybrid', '1.2 Turbo'] },
      { name: 'Auris', engines: ['1.4 D-4D', '1.6 Valvematic', '1.33 Dual VVT-i'] },
      { name: 'RAV4', engines: ['2.5 Hybrid', '2.0'] },
      { name: 'Hilux', engines: ['2.4 D-4D', '2.8 D-4D'] },
      { name: 'Proace City', engines: ['1.5 D'] },
      { name: 'Avensis', engines: ['1.6 D-4D', '2.0 D-4D', '1.6'] },
    ],
  },
  {
    brand: 'Hyundai',
    models: [
      { name: 'i20', engines: ['1.4 MPI', '1.2 MPI', '1.0 T-GDI'] },
      { name: 'Tucson', engines: ['1.6 CRDi', '1.6 T-GDI', '1.6 Hibrit'] },
      { name: 'Accent Blue', engines: ['1.6 CRDi', '1.4 D-CVVT'] },
      { name: 'Accent Era', engines: ['1.5 CRDi', '1.4 DOHC'] },
      { name: 'Bayon', engines: ['1.4 MPI', '1.0 T-GDI'] },
      { name: 'Elantra', engines: ['1.6 D-CVVT', '1.6 MPi'] },
      { name: 'i10', engines: ['1.0 MPI', '1.2 MPI'] },
      { name: 'Kona', engines: ['1.0 T-GDI', '1.6 CRDi', 'Elektrik'] },
      { name: 'Santa Fe', engines: ['2.2 CRDi', '1.6 T-GDI Hibrit'] },
      { name: 'H-100 / Staria', engines: ['2.2 CRDi', '2.5 CRDi'] },
    ],
  },
  {
    brand: 'Peugeot',
    models: [
      { name: '208', engines: ['1.2 PureTech', '1.5 BlueHDi'] },
      { name: '301', engines: ['1.6 HDi', '1.5 BlueHDi', '1.2 PureTech'] },
      { name: '2008', engines: ['1.2 PureTech', '1.5 BlueHDi', 'e-2008 Elektrik'] },
      { name: '3008', engines: ['1.5 BlueHDi', '1.2 PureTech', '1.6 PureTech'] },
      { name: '5008', engines: ['1.5 BlueHDi', '1.2 PureTech'] },
      { name: '308', engines: ['1.2 PureTech', '1.5 BlueHDi', '1.6 e-HDi'] },
      { name: '408', engines: ['1.2 PureTech'] },
      { name: '508', engines: ['1.5 BlueHDi', '1.6 PureTech'] },
      { name: 'Rifter', engines: ['1.5 BlueHDi'] },
      { name: 'Partner', engines: ['1.6 HDi', '1.5 BlueHDi'] },
      { name: 'Boxer', engines: ['2.2 BlueHDi'] },
    ],
  },
  {
    brand: 'Opel',
    models: [
      { name: 'Astra', engines: ['1.2 Turbo', '1.5 D', '1.6 CDTI', '1.4 Turbo', '1.6'] },
      { name: 'Corsa', engines: ['1.2', '1.2 Turbo', '1.5 D', '1.4', '1.3 CDTI'] },
      { name: 'Crossland', engines: ['1.2 Turbo', '1.5 D'] },
      { name: 'Mokka', engines: ['1.2 Turbo', 'Elektrik'] },
      { name: 'Grandland', engines: ['1.5 D', '1.2 Turbo'] },
      { name: 'Insignia', engines: ['1.6 CDTI', '1.5 Turbo', '2.0 CDTI'] },
      { name: 'Combo', engines: ['1.5 D', '1.6 CDTI'] },
      { name: 'Zafira', engines: ['1.6 CDTI', '2.0 CDTI'] },
    ],
  },
  {
    brand: 'Honda',
    models: [
      { name: 'Civic Sedan', engines: ['1.6 i-VTEC (LPG)', '1.5 VTEC Turbo', '1.6 i-DTEC'] },
      { name: 'City', engines: ['1.5 i-VTEC'] },
      { name: 'CR-V', engines: ['1.5 VTEC Turbo', '1.6 i-DTEC', '2.0 e:HEV'] },
      { name: 'HR-V', engines: ['1.5 e:HEV Hibrit'] },
      { name: 'Jazz', engines: ['1.5 e:HEV', '1.3 i-VTEC'] },
      { name: 'Accord', engines: ['1.5 VTEC Turbo', '2.0 i-VTEC'] },
    ],
  },
  {
    brand: 'Dacia',
    models: [
      { name: 'Duster', engines: ['1.5 dCi', '1.0 ECO-G (LPG)', '1.3 TCe'] },
      { name: 'Sandero Stepway', engines: ['1.0 ECO-G', '1.0 TCe', '0.9 TCe', '1.5 dCi'] },
      { name: 'Sandero', engines: ['1.0 SCe', '0.9 TCe', '1.5 dCi'] },
      { name: 'Jogger', engines: ['1.0 ECO-G (LPG)', '1.0 TCe', '1.6 Hibrit'] },
      { name: 'Lodgy', engines: ['1.5 dCi'] },
      { name: 'Dokker', engines: ['1.5 dCi'] },
    ],
  },
  {
    brand: 'BMW',
    models: [
      { name: '3 Serisi (G20/F30)', engines: ['320i 1.6 Turbo', '320d 2.0', '318i 1.5'] },
      { name: '5 Serisi (G30/F10)', engines: ['520i 1.6', '520d 2.0', '525d xDrive'] },
      { name: '1 Serisi (F40/F20)', engines: ['116d 1.5', '118i 1.5'] },
      { name: '2 Serisi Gran Coupe', engines: ['216d 1.5', '218i 1.5'] },
      { name: 'X1', engines: ['sDrive16d', 'sDrive18i', 'xDrive20d'] },
      { name: 'X3', engines: ['xDrive20d', 'xDrive20i'] },
      { name: 'X5', engines: ['xDrive30d', 'xDrive25d'] },
      { name: '4 Serisi Gran Coupe', engines: ['420i 1.6', '420d 2.0'] },
    ],
  },
  {
    brand: 'Mercedes-Benz',
    models: [
      { name: 'C-Serisi (W206/W205)', engines: ['C 200 1.5', 'C 200 d 1.6', 'C 180 1.6', 'C 220 d'] },
      { name: 'E-Serisi (W214/W213)', engines: ['E 200 d', 'E 220 d', 'E 180', 'E 200'] },
      { name: 'A-Serisi', engines: ['A 180 d', 'A 200 1.33'] },
      { name: 'CLA', engines: ['CLA 180 d', 'CLA 200 1.33'] },
      { name: 'GLA / GLB', engines: ['GLA 200', 'GLB 200', 'GLA 180 d'] },
      { name: 'GLC', engines: ['GLC 220 d', 'GLC 300'] },
      { name: 'Vito / V-Serisi', engines: ['111 CDI', '114 CDI', '119 CDI'] },
      { name: 'Sprinter', engines: ['314 CDI', '316 CDI', '416 CDI'] },
    ],
  },
  {
    brand: 'Audi',
    models: [
      { name: 'A3 Sedan', engines: ['35 TFSI 1.5', '30 TDI 1.6', '1.6 TDI', '1.0 TFSI'] },
      { name: 'A3 Sportback', engines: ['35 TFSI 1.5', '30 TDI 1.6'] },
      { name: 'A4 Sedan', engines: ['40 TDI 2.0', '40 TFSI 2.0', '2.0 TDI'] },
      { name: 'A6 Sedan', engines: ['40 TDI 2.0', '45 TFSI 2.0', '50 TDI 3.0'] },
      { name: 'Q2', engines: ['35 TFSI 1.5', '30 TDI 1.6'] },
      { name: 'Q3', engines: ['35 TFSI 1.5', '40 TDI 2.0'] },
      { name: 'Q5', engines: ['40 TDI 2.0'] },
    ],
  },
  {
    brand: 'Skoda',
    models: [
      { name: 'Octavia', engines: ['1.5 TSI e-TEC', '1.0 TSI', '1.6 TDI', '2.0 TDI'] },
      { name: 'Superb', engines: ['1.5 TSI', '2.0 TDI', '1.6 TDI'] },
      { name: 'Scala', engines: ['1.0 TSI', '1.5 TSI', '1.6 TDI'] },
      { name: 'Kamiq', engines: ['1.0 TSI', '1.5 TSI'] },
      { name: 'Karoq', engines: ['1.5 TSI', '1.6 TDI'] },
      { name: 'Kodiaq', engines: ['1.5 TSI', '2.0 TDI'] },
      { name: 'Fabia', engines: ['1.0 TSI', '1.0 MPI'] },
    ],
  },
  {
    brand: 'Seat',
    models: [
      { name: 'Leon', engines: ['1.5 eTSI', '1.0 eTSI', '1.6 TDI', '1.4 TSI', '1.2 TSI'] },
      { name: 'Ibiza', engines: ['1.0 TSI', '1.0 EVO', '1.2 TSI', '1.4'] },
      { name: 'Arona', engines: ['1.0 TSI', '1.6 TDI'] },
      { name: 'Ateca', engines: ['1.5 TSI', '1.6 TDI'] },
      { name: 'Tarraco', engines: ['1.5 TSI', '2.0 TDI'] },
    ],
  },
  {
    brand: 'Nissan',
    models: [
      { name: 'Qashqai', engines: ['1.3 DIG-T', '1.5 e-Power', '1.5 dCi', '1.6 dCi', '1.2 DIG-T'] },
      { name: 'Juke', engines: ['1.0 DIG-T', '1.5 dCi'] },
      { name: 'Micra', engines: ['1.0 DIG-T', '1.2'] },
      { name: 'X-Trail', engines: ['1.5 e-Power', '1.6 dCi', '1.7 dCi'] },
      { name: 'Navara', engines: ['2.3 dCi'] },
    ],
  },
  {
    brand: 'Kia',
    models: [
      { name: 'Sportage', engines: ['1.6 CRDi', '1.6 T-GDI', '1.6 Hibrit'] },
      { name: 'Ceed', engines: ['1.6 CRDi', '1.0 T-GDI', '1.5 T-GDI'] },
      { name: 'Stonic', engines: ['1.4 MPI', '1.0 T-GDI'] },
      { name: 'Rio', engines: ['1.4 MPI', '1.2 MPI'] },
      { name: 'Picanto', engines: ['1.0 MPI', '1.2 MPI'] },
      { name: 'Cerato', engines: ['1.6 CRDi', '1.6 MPI'] },
      { name: 'Niro', engines: ['1.6 Hibrit', 'Elektrik'] },
    ],
  },
  {
    brand: 'Citroen',
    models: [
      { name: 'C-Elysee', engines: ['1.5 BlueHDi', '1.6 HDi', '1.2 PureTech'] },
      { name: 'C3', engines: ['1.2 PureTech', '1.5 BlueHDi'] },
      { name: 'C3 Aircross', engines: ['1.2 PureTech', '1.5 BlueHDi'] },
      { name: 'C4 / C4 X', engines: ['1.2 PureTech', '1.5 BlueHDi', 'e-C4 Elektrik'] },
      { name: 'C5 Aircross', engines: ['1.5 BlueHDi', '1.6 PureTech', '1.2 Hibrit'] },
      { name: 'Berlingo', engines: ['1.5 BlueHDi', '1.6 HDi'] },
      { name: 'Jumper', engines: ['2.2 BlueHDi'] },
    ],
  },
  {
    brand: 'Togg',
    models: [
      { name: 'T10X', engines: ['V1 RWD Standart (218 HP)', 'V2 RWD Uzun Menzil (218 HP)', 'V2 AWD Çift Motor'] },
      { name: 'T10F', engines: ['RWD Standart', 'RWD Uzun Menzil'] },
    ],
  },
  {
    brand: 'Volvo',
    models: [
      { name: 'XC40', engines: ['T3 1.5', 'B4 Mild Hybrid', 'Recharge Elektrik'] },
      { name: 'XC60', engines: ['B4 Dizel', 'B5 Benzin', 'T8 Plug-in Hybrid'] },
      { name: 'XC90', engines: ['B5 Dizel', 'T8 Plug-in Hybrid'] },
      { name: 'S60', engines: ['B5 Mild Hybrid', '2.0 T'] },
      { name: 'S90', engines: ['B5 Dizel', 'B5 Benzin'] },
      { name: 'V40', engines: ['D2 1.6/2.0', 'T3 1.5'] },
    ],
  },
  {
    brand: 'Cupra',
    models: [
      { name: 'Formentor', engines: ['1.5 TSI (150 HP)', '2.0 VZ (310 HP)'] },
      { name: 'Leon', engines: ['1.5 eTSI', '2.0 VZ'] },
      { name: 'Ateca', engines: ['2.0 VZ'] },
    ],
  },
  {
    brand: 'Chery',
    models: [
      { name: 'Omoda 5', engines: ['1.6 TGDI'] },
      { name: 'Tiggo 7 Pro', engines: ['1.6 TGDI'] },
      { name: 'Tiggo 8 Pro', engines: ['1.6 TGDI'] },
    ],
  },
  {
    brand: 'Suzuki',
    models: [
      { name: 'Vitara', engines: ['1.4 Boosterjet Hibrit'] },
      { name: 'Swift', engines: ['1.2 Dualjet Hibrit'] },
      { name: 'Jimny', engines: ['1.5'] },
      { name: 'S-Cross', engines: ['1.4 Boosterjet Hibrit'] },
    ],
  },
  {
    brand: 'Mitsubishi',
    models: [
      { name: 'L200', engines: ['2.2 DI-D', '2.4 DI-D'] },
      { name: 'ASX', engines: ['1.6', '1.0 T', '1.3 Mild Hybrid'] },
      { name: 'Space Star', engines: ['1.2 MIVEC'] },
    ],
  },
  {
    brand: 'Jeep',
    models: [
      { name: 'Renegade', engines: ['1.3 T-GDI', '1.6 Multijet', '1.5 e-Hybrid', '4xe'] },
      { name: 'Compass', engines: ['1.3 T-GDI', '1.6 Multijet', '1.5 e-Hybrid', '4xe'] },
    ],
  },
];

// Yıl Listesi: Gelecek yıldan 1985'e kadar
const currentYear = new Date().getFullYear();
export const YEAR_OPTIONS: number[] = [];
for (let y = currentYear + 1; y >= 1990; y--) {
  YEAR_OPTIONS.push(y);
}

/**
 * Marka listesini döner
 */
export const getAllBrands = (): string[] => {
  return POPULAR_CAR_DATABASE.map((c) => c.brand);
};

/**
 * Seçilen markaya göre model listesini döner
 */
export const getModelsForBrand = (brandName: string): { name: string; engines: string[] }[] => {
  const brand = POPULAR_CAR_DATABASE.find(
    (b) => b.brand.toLowerCase() === brandName.toLowerCase()
  );
  return brand ? brand.models : [];
};
