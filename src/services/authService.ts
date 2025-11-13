import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

interface LoginResponse {
  token: string;
}

interface LoginRequest {
  username: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axios.post(`${API_URL}user/v1/login`, credentials);

      const token = response.data?.data?.token;

      if (!token) {
        throw new Error('Token tidak ditemukan di response API');
      }

      return { token };
    } catch (error: any) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },
};
