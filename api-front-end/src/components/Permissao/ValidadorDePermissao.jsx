import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [permissoes, setPermissoes] = useState([]);

  const carregarPermissoes = () => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
          console.log("Permissões carregadas:", decoded.permissoes);
      setPermissoes(decoded.permissoes || []);
    } else {
      setPermissoes([]);
    }
  };

  useEffect(() => {
    carregarPermissoes();
  }, []);

  const hasPermission = (name) =>
    permissoes.some((p) => p.descricao === name);

  return (
    <AuthContext.Provider value={{ permissoes, hasPermission, carregarPermissoes }}>
      {children}
    </AuthContext.Provider>
  );
}
