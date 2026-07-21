import cliente from '../../../api/apiClient';

export const dniService = {
  verificar: async (dni: string) => {
    try {
      const response = await cliente.get(`/auth/dni/${dni}`);
      // Aseguramos que devolvemos la data del response
      return response.data;
    } catch (error) {
      console.error("Error en servicio DNI:", error);
      throw error;
    }
  }
};