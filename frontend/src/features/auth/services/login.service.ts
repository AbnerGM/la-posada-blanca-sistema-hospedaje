import cliente from '../../../api/apiClient';
import type { LoginRequest, LoginResponse } from '../types/login.types';

export const loginService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await cliente.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },
};