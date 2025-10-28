import type React from "react"
import { useState } from "react"
import { User, Lock, Eye, EyeOff, Loader, AlertCircle } from "lucide-react"
import { useAuth } from "../hooks/useAuth"

interface LoginPageProps {
  onLogin: (userEmail: string, password: string) => void
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [userEmail, setuserEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login, errorlogin, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!userEmail || !password) {
      setError("Por favor, ingrese usuario y contraseña")
      setShowError(true)
      return
    }

    setError(null)
    setShowError(false)
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await login({ userEmail, password })

      if (errorlogin) {
        console.error("Error durante el login:", errorlogin)
        setError("Usuario o contraseña incorrectos")
        setShowError(true)
        setIsLoading(false)
        return
      }

      onLogin(userEmail, password)
      setIsLoading(false)
    } catch (err: any) {
      console.error("Error durante el login:", err)
      setError("Error inesperado. Intenta más tarde.")
      setShowError(true)
      setIsLoading(false)
    }
  }

  return (
    <div
      className="
        min-h-screen 
        w-full 
        flex 
        bg-[url('https://images.pexels.com/photos/23656142/pexels-photo-23656142.jpeg')] 
        bg-cover 
        bg-center 
        bg-no-repeat
      "
    >
      <div className="absolute inset-0 bg-black/40" />

      {/* Lado izquierdo - Formulario de login */}
      <div
        className="bg-black/10 w-full lg:w-[35%] xl:w-[30%] min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 relative"
        style={{
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="w-full max-w-xs sm:max-w-sm">
          <div className="w-full relative z-10 rounded-2xll">
            {/* Logo de la empresa */}
            <div className="flex justify-center mb-6">
              <img
                src="../../../public/LogoMundoEscolar.png"
                alt="Logo Mundo Escolar"
                className="w-35 h-35 object-contain drop-shadow-md"
              />
            </div>

            <div className="text-center space-y-1 mb-6">
              <h1 className="text-2xl font-bold text-black font-sans">Bienvenido</h1>
              <p className="text-black/80 font-sans text-sm">
                Inicia sesión en tu cuenta para continuar
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="userEmail" className="text-xs font-medium text-black font-sans">
                  Usuario
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/80" size={16} />
                  <input
                    id="userEmail"
                    type="text"
                    placeholder="admin"
                    value={userEmail}
                    onChange={(e) => setuserEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border text-black placeholder:text-black/50 bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] focus:bg-white/15 transition-all duration-200 font-sans"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.6)",
                    }}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="password" className="text-xs font-medium text-black font-sans">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={16} />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="1234"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border text-black bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-[#4a9d9d] focus:border-[#4a9d9d] focus:bg-white/15 transition-all duration-200 font-sans"
                    style={{
                      borderColor: "rgba(255, 255, 255, 0.6)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black/50 hover:text-black/70 transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full py-3 rounded-lg font-sans font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
                style={{
                  backgroundColor: "#4a9d9d",
                  boxShadow: "0 6px 18px rgba(74, 157, 157, 0.4)",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.backgroundColor = "#5aadad"
                    e.currentTarget.style.boxShadow = "0 8px 22px rgba(90, 173, 173, 0.6)"
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#4a9d9d"
                  e.currentTarget.style.boxShadow = "0 6px 18px rgba(74, 157, 157, 0.4)"
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="animate-spin" size={16} />
                    <span>Ingresando...</span>
                  </div>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>

              {error && showError && (
                <div className="bg-red-50/10 backdrop-blur-sm border border-red-200 p-3 rounded-lg text-black text-center font-medium text-sm mt-4 flex items-center justify-center space-x-2">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div className="text-center mt-4">
              <a
                href="#"
                className="text-xs text-black/60 hover:text-black font-sans transition-colors"
                onClick={(e) => e.preventDefault()}
              >
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Lado derecho - Imagen de fondo */}
      <div className="hidden lg:flex lg:w-[65%] xl:w-[70%] relative overflow-hidden flex-col justify-center items-center">
        <div className="absolute inset-0"></div>
        <div className="relative z-10 p-8 text-center">
          <h2 className="text-4xl xl:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-2xl">
            Bienvenido de vuelta
          </h2>
          <p className="text-lg xl:text-xl text-white/90 max-w-md mx-auto leading-relaxed font-light">
            Accede a tu cuenta y continúa donde lo dejaste
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
