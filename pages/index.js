import { useState, useEffect } from "react";
import Home from "../componentes/home";
import Login from "../componentes/login";
import UsuarioService from "../services/UsuarioService";

const usuarioService = new UsuarioService();

export default function Index() {
  const [estaAutenticado, setEstaAutenticado] = useState(null);

  useEffect(() => {
    setEstaAutenticado(
      usuarioService.estaAutenticado()
    );
  }, []); // [] chama apenas uma vez após renderizar o componente

  if (estaAutenticado === null) {
    return null;
  }

  // verifica se o usuário está autenticado
  if (estaAutenticado) {
    return <Home />;
  }

  return <Login aposAutenticacao={() => setEstaAutenticado(true)} />;
}
