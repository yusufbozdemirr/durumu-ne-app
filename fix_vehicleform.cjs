const fs = require('fs');
let content = fs.readFileSync('src/components/vehicles/VehicleForm.tsx', 'utf-8');

// For text-sm in inputs/textareas to text-base
content = content.replace(/text-sm/g, 'text-base');

fs.writeFileSync('src/components/vehicles/VehicleForm.tsx', content);
