const fs = require('fs');

const appCtxStr = fs.readFileSync('src/context/AppContext.tsx', 'utf-8');
const newAppCtxStr = appCtxStr.replace(
  "isLoading: boolean;",
  "isLoading: boolean;\n  isPlanModalOpen: boolean;\n  setIsPlanModalOpen: (open: boolean) => void;"
).replace(
  "const [isLoading, setIsLoading] = useState(true);",
  "const [isLoading, setIsLoading] = useState(true);\n  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);"
).replace(
  "isLoading,\n",
  "isLoading,\n        isPlanModalOpen,\n        setIsPlanModalOpen,\n"
);
fs.writeFileSync('src/context/AppContext.tsx', newAppCtxStr);

const modalStr = fs.readFileSync('src/components/common/TrialReminderModal.tsx', 'utf-8');
let newModalStr = modalStr.replace(
  "const [isOpen, setIsOpen] = useState(true);",
  "const { isPlanModalOpen, setIsPlanModalOpen } = useApp();\n  const isOpen = isPlanModalOpen;"
).replace(
  "onClick={() => setIsOpen(false)}",
  "onClick={() => setIsPlanModalOpen(false)}"
).replace(
  "onClick={() => setIsOpen(false)}",
  "onClick={() => setIsPlanModalOpen(false)}"
).replace(
  "if (isAdmin || !planStatus.isTrial || planStatus.isExpired || !isOpen) {",
  "if (isAdmin || !isOpen) {" // allow both pro and trial
);

newModalStr = newModalStr.replace(
  "const trialEndDateObj = planStatus.trialEndDate",
  "const trialEndDateObj = (planStatus.isPro ? planStatus.trialEndDate : planStatus.trialEndDate) // Wait, let's fix this correctly."
);

fs.writeFileSync('src/components/common/TrialReminderModal.tsx', newModalStr);

