const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');
content = content.replace(
  /<Route path="\/t\/:token" element=\{<TrackVehiclePage \/>\} \/>/g,
  ''
);
fs.writeFileSync('src/App.tsx', content);
