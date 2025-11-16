import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const ValidadorDePermissao = createContext();

export function AuthProvider({ children }) {
  const [permissoes, setPermissoes] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      setPermissoes(decoded.permissoes || []);
    }
  }, []);

  const hasPermission = (name) =>
    permissoes.some((p) => p.descricao === name);

  return (
    <ValidadorDePermissao.Provider value={{ permissoes, hasPermission }}>
      {children}
    </ValidadorDePermissao.Provider>
  );
}
