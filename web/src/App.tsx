import { useEffect } from "react";
import { createDemoUser } from "./services/AuthStorage.js";
import AppRoutes from "./routes/AppRoutes.js";

function App() {
  useEffect(() => {
    createDemoUser();
  }, []);

  return <AppRoutes />
  
}

export default App
