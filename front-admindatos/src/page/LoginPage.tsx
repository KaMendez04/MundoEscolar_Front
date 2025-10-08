import { useState } from "react";
import { User, Lock, Eye, EyeOff, Loader, AlertCircle } from "lucide-react";

interface LoginPageProps {
  onLogin: (username: string, password: string) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Por favor, ingrese usuario y contraseña');
      setShowError(true);
      return;
    }

    setError(null);
    setShowError(false);
    setIsLoading(true);
    
    try {
      // Simulate loading
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulate credential validation locally
      if (username !== 'admin' || password !== '1234') {
        setError('Usuario o contraseña incorrectos');
        setShowError(true);
        setIsLoading(false);
        return;
      }
      
      // If credentials are correct, call onLogin
      onLogin(username, password);
      setIsLoading(false);
      
    } catch (err: any) {
      console.error('Error durante el login:', err);
      setError('Error inesperado. Intenta más tarde.');
      setShowError(true);
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with: ${provider}`);
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center p-4"
  style={{
    width: "100%",
    height: "100vh",
    backgroundImage: "url('https://images.pexels.com/photos/1287142/pexels-photo-1287142.jpeg')",
    backgroundSize: "cover",         // cubre todo el contenedor
    backgroundPosition: "center",    // centrada
    backgroundRepeat: "no-repeat",
  }}
>

      {/* Main Card */}
      <div
        className="max-w-sm w-full relative z-10 rounded-2xl p-6 border-0 shadow-xl"
        style={{
          background: "rgba(255, 255, 255, 0.25)",
          backdropFilter: "blur(40px) saturate(250%)",
          border: "1px solid rgba(255, 255, 255, 0.4)",
          boxShadow:
            "0 20px 50px rgba(0, 0, 0, 0.3), 0 10px 40px rgba(255, 255, 255, 0.2), inset 0 2px 0 rgba(255, 255, 255, 0.6), inset 0 -1px 0 rgba(255, 255, 255, 0.3)",
        }}
      >
        {/* Header */}
        <div className="text-center space-y-1 mb-6">
          <h1 className="text-2xl font-bold text-black font-sans">Bienvenido</h1>
          <p className="text-black/80 font-sans text-sm">
            Inicia sesión en tu cuenta para continuar
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="username" className="text-xs font-medium text-black font-sans">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50" size={16} />
              <input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 text-sm rounded-lg border text-black placeholder:text-black/50 bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200 font-sans"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.6)",
                }}
                required
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
                type={showPassword ? 'text' : 'password'}
                placeholder="1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm rounded-lg border text-black  bg-white/10 backdrop-blur-sm focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:bg-white/15 transition-all duration-200 font-sans"
                style={{
                  borderColor: "rgba(255, 255, 255, 0.6)",
                }}
                required
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
  type="submit"
  className="w-full py-3 rounded-lg font-sans font-semibold text-white text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-4 flex items-center justify-center"
  style={{ 
    backgroundColor: "#2563eb",
    boxShadow: "0 6px 20px rgba(37, 99, 235, 0.4)",
  }}
  onMouseEnter={(e) => {
    if (!isLoading) {
      const target = e.target as HTMLButtonElement;
      target.style.backgroundColor = "#1d4ed8";
      target.style.boxShadow = "0 8px 25px rgba(29, 78, 216, 0.6)";
    }
  }}
  onMouseLeave={(e) => {
    const target = e.target as HTMLButtonElement;
    target.style.backgroundColor = "#2563eb";
    target.style.boxShadow = "0 6px 20px rgba(37, 99, 235, 0.4)";
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
          {/* Error Message */}
          {error && showError && (
            <div className="bg-red-50/10 backdrop-blur-sm border border-red-200 p-3 rounded-lg text-red-700 text-center font-medium text-sm mt-4 flex items-center justify-center space-x-2">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="relative flex justify-center text-xs">
            <span className="px-2 text-black/60 font-sans">O continúa con</span>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => handleSocialLogin("Google")}
            className="w-full py-2.5 px-3 rounded-lg border bg-white/70 backdrop-blur-sm hover:bg-white/85 text-black font-sans text-sm transition-all duration-300 flex items-center justify-center space-x-2"
            style={{
              borderColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 2.43-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continuar con Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("Apple")}
            className="w-full py-2.5 px-3 rounded-lg border bg-white/70 backdrop-blur-sm hover:bg-white/85 text-black font-sans text-sm transition-all duration-300 flex items-center justify-center space-x-2"
            style={{
              borderColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 384 512" fill="currentColor">
              <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
            </svg>
            <span>Continuar con Apple</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialLogin("Meta")}
            className="w-full py-2.5 px-3 rounded-lg border bg-white/70 backdrop-blur-sm hover:bg-white/85 text-black font-sans text-sm transition-all duration-300 flex items-center justify-center space-x-2"
            style={{
              borderColor: "rgba(255, 255, 255, 0.6)",
            }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
            </svg>
            <span>Continuar con Meta</span>
          </button>
        </div>

        {/* Forgot password link */}
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
  );
};

export default LoginPage;