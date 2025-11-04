import client from "../Client/ConfigClient";
import type { NotificacionResponse, ContadorResponse, MarcarLeidaRequest } from "../types/notifications";


class NotificacionService {
  private readonly baseURL = "/Notificaciones";

  /**
   * Obtiene las notificaciones de stock bajo
   */
  async obtenerNotificaciones(
    soloNoLeidas: boolean = true,
    top: number = 50
  ): Promise<NotificacionResponse> {
    try {
      console.log(`📡 GET ${this.baseURL}?soloNoLeidas=${soloNoLeidas}&top=${top}`);
      const response = await client.get<NotificacionResponse>(this.baseURL, {
        params: { soloNoLeidas, top }
      });
      console.log("✅ Respuesta recibida:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en obtenerNotificaciones:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Obtiene el contador de notificaciones no leídas
   */
  async obtenerContador(): Promise<ContadorResponse> {
    try {
      console.log(`📡 GET ${this.baseURL}/contador`);
      const response = await client.get<ContadorResponse>(`${this.baseURL}/contador`);
      console.log("✅ Contador recibido:", response.data);
      return response.data;
    } catch (error: any) {
      console.error("❌ Error en obtenerContador:", error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Marca una o varias notificaciones como leídas
   */
  async marcarComoLeida(request: MarcarLeidaRequest): Promise<void> {
    await client.put(`${this.baseURL}/marcar-leida`, request);
  }

  /**
   * Marca todas las notificaciones como leídas
   */
  async marcarTodasComoLeidas(): Promise<void> {
    // Primero obtenemos todas las notificaciones no leídas
    const notificaciones = await this.obtenerNotificaciones(true);
    
    // Marcamos cada una como leída (podrías mejorar esto con un endpoint bulk en el backend)
    const promises = notificaciones.data.map((n: any) => 
      this.marcarComoLeida({ idNotificacion: n.idNotificacion })
    );
    
    await Promise.all(promises);
  }
}

export default new NotificacionService();