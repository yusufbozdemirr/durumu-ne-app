const fs = require('fs');
let content = fs.readFileSync('src/components/vehicles/VehicleForm.tsx', 'utf-8');

// For <label> elements, change text-base back to text-sm
content = content.replace(/<label([^>]+)text-base/g, '<label$1text-sm');

// Also for any div wrapping an icon and text maybe, but text-sm in inputs is what we want.
// Let's just make sure <input and <textarea have text-base.

fs.writeFileSync('src/components/vehicles/VehicleForm.tsx', content);
