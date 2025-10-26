import client from "../Client/ConfigClient";
import type { Auth } from "../types/auth";

export const authService = {
    login: async (auth: Auth): Promise<string> => {
        const response = await client.post<string>('/Auth', auth);
        return response.data;
    }
};