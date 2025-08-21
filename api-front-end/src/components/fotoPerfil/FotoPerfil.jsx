import { useRef, useState } from "react";
import perfil from "../../Pages/Perfil/perfil.png";
import icone_lapis from "../../Pages/Perfil/lapis-edicao.png";
import styles from "./fotoPerfil.module.css"; // certifique-se de que o caminho está correto

export default function FotoPerfil() {
  const fileInputRef = useRef(null);
  const [profileImage, setProfileImage] = useState(perfil); // estado para imagem

  const handleButtonClick = () => {
    fileInputRef.current.click(); // dispara o input escondido
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // cria URL temporária
      setProfileImage(imageUrl); // atualiza o estado com a nova imagem
    }
  };

  return (
    <div className={styles.foto_container}>
      <div className={styles.profilePictureContainer}>
        <img
          src={profileImage}
          alt="Foto de perfil"
          className={styles.profilePicture}
        />
        <button
          type="button"
          className={styles.editButton}
          onClick={handleButtonClick}
        >
          <img src={icone_lapis} alt="Editar" />
        </button>

        {/* input escondido */}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
