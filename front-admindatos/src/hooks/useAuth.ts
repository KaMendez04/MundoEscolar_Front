import { useState } from "react";
import { authService } from "../services/authService";
import type { Auth } from "../types/auth";

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [errorlogin, setError] = useState<string | null>(null);

    const login = async (auth: Auth) => {
        setLoading(true);
        setError(null);
        try {
            const token = await authService.login(auth);
            console.log("Token recibido:", token);
            localStorage.setItem("token", token);
            return token;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || err.response?.data || err.message || 'Error al hacer login';
            setError(errorMsg);
            throw new Error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return { loading, errorlogin, login };
};