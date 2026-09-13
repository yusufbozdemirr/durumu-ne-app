const fs = require('fs');

let content = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');

// Add the state variable
content = content.replace(
  "const [isLoading, setIsLoading] = useState<boolean>(true);",
  "const [isLoading, setIsLoading] = useState<boolean>(true);\n  const [isPlanModalOpen, setIsPlanModalOpen] = useState<boolean>(false);"
);

fs.writeFileSync('src/context/AppContext.tsx', content);
console.log("Fixed AppContext.tsx");
