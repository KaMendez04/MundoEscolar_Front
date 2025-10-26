import { Outlet } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import LoginPage from "../../page/LoginPage";
import NavBar from "./NavBar";
import LoadingScreen from "../../components/MainComponents/LoadingScreen"; // Ajusta la ruta según tu estructura

const RootLayout = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  // Leer login de localStorage al iniciar
  useEffect(() => {
    const logged = localStorage.getItem("loggedIn");
    if (logged === "true") {
      setIsLoggedIn(true);
      setIsAppReady(true); // Si ya estaba logueado, ir directo al sistema
    }
  }, []);

  // Manejo de login
  const handleLogin = (username: string, password: string) => {
    if (username === "admin" && password === "1234") {
      setIsLoggedIn(true);
      localStorage.setItem("loggedIn", "true");
      
      // Activar LoadingScreen después del login
      setShowLoadingScreen(true);
    } else {
      alert("Usuario o contraseña incorrectos ");
    }
  };

  // Cuando el LoadingScreen termina, mostrar el sistema
  const handleLoadingComplete = () => {
    setShowLoadingScreen(false);
    setIsAppReady(true);
  };

  // Manejo de logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsAppReady(false);
    setShowLoadingScreen(false);
    localStorage.removeItem("loggedIn");
  };

  // Si no está logueado → mostrar LoginPage
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Si está logueado pero mostrando LoadingScreen
  if (showLoadingScreen) {
    return (
      <LoadingScreen 
        onLoadingComplete={handleLoadingComplete}
        duration={3000} // 3 segundos, puedes ajustarlo
      />
    );
  }

  // Si está logueado y el sistema está listo → mostrar NavBar con contenido
  if (isAppReady) {
    return (
      <NavBar onLogout={handleLogout}>
        <Outlet />
      </NavBar>
    );
  }

  // Fallback (no debería llegar aquí)
  return null;
};

export default RootLayout;