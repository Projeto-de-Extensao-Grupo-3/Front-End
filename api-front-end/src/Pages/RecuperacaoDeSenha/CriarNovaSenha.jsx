import styles from "./esqueci-senha.module.css"
import { useState } from "react"
import { Navbar } from "../../components/Navbar/Navbar"
import axios from "axios"

// Material UI
import {
  Button, OutlinedInput, InputAdornment, IconButton,
  Typography, Collapse, Alert
} from "@mui/material"
import { Visibility, VisibilityOff, Close as CloseIcon } from "@mui/icons-material"

import AlertDialog from "../../components/AlertDialog/AlertDialog"

export function CriarNovaSenha() {

  // Estados de alerta (unificados)
  const [alert, setAlert] = useState({
    open: false,
    type: "",
    title: "",
    message: ""
  });

  // Estados de erro dos campos
  const [erroNovaSenhaInvalida, setErroNovaSenhaInvalida] = useState("");
  const [erroNovaSenhaDiferente, setErroNovaSenhaDiferente] = useState("");

  // Mostrar/ocultar senha
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmar, setShowPasswordConfirmar] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErroNovaSenhaInvalida("");
    setErroNovaSenhaDiferente("");

    const formData = new FormData(e.currentTarget);
    const { novaSenha, confirmarSenha } = Object.fromEntries(formData.entries());

    // ✔ Validação de senha extraída para uma função
    const senhaValida =
      novaSenha.length >= 8 &&
      /[^a-zA-Z0-9]/.test(novaSenha) &&
      !/\s/.test(novaSenha);

    if (!senhaValida) {
      setErroNovaSenhaInvalida("A nova senha deve ter pelo menos 8 caracteres, incluindo um caractere especial e sem espaços");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErroNovaSenhaDiferente("As senhas não coincidem");
      return;
    }

    try {
      await axios.post("http://localhost:8080/funcionarios/resetar-senha", {
        token,
        novaSenha
      });

      setAlert({
        open: true,
        type: "success",
        title: "Alteração bem sucedida!",
        message: "A senha foi alterada com sucesso."
      });

    } catch (err) {
      console.error(err);
      setAlert({
        open: true,
        type: "error",
        title: "Erro ao alterar senha",
        message: "Ocorreu um erro ao tentar alterar a senha."
      });
    }
  };

  return (
    <div className={styles.base}>
      <Navbar vazio />

      <div className={styles.content}>
        <AlertDialog
          alertType={alert.type}
          alertTitle={alert.title}
          alertMessage={alert.message}
          state={alert.open}
        />

        <div className={styles.box}>
          <span className={styles.indicator}>Crie uma nova senha</span>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* Nova Senha */}
            <h3>Nova Senha</h3>
            <OutlinedInput
              name="novaSenha"
              fullWidth
              error={!!erroNovaSenhaInvalida}
              type={showPassword ? "text" : "password"}
              sx={{ width: "35vw" }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Typography variant="caption" color="error">{erroNovaSenhaInvalida}</Typography>

            {/* Confirmar Senha */}
            <h3>Confirmar Nova Senha</h3>
            <OutlinedInput
              name="confirmarSenha"
              fullWidth
              error={!!erroNovaSenhaDiferente}
              type={showPasswordConfirmar ? "text" : "password"}
              sx={{ width: "35vw" }}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPasswordConfirmar(v => !v)}>
                    {showPasswordConfirmar ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <Typography variant="caption" color="error">{erroNovaSenhaDiferente}</Typography>

            <div className={styles.divBotao}>
              <Button type="submit" variant="contained">
                Atualizar Senha
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
