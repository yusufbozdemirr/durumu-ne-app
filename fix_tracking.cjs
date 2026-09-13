const fs = require('fs');

const filesToUpdate = [
  'src/App.tsx',
  'src/components/vehicles/VehicleTable.tsx',
  'src/components/vehicles/VehicleCard.tsx',
  'src/pages/VehicleDetailPage.tsx'
];

filesToUpdate.forEach(file => {
  let content = fs.readFileSync(file, 'utf-8');
  content = content.replace(/\/takip\//g, '/t/');
  content = content.replace(/\/track\/:token/g, '/t/:token');
  fs.writeFileSync(file, content);
});
console.log('Tracking links updated to /t/');
