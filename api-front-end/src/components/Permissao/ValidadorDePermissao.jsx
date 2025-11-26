import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setPermissoes(decoded.permissoes || []);
       console.log("Permissões carregadas:", decoded.permissoes || []);
    }
  }, []);

  const hasPermission = (name) =>
    permissoes.some((p) => p.descricao === name);

  return (
    <AuthContext.Provider value={{ permissoes, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
