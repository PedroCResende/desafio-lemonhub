import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

//const API_BASE_URL = 'http://10.0.2.2:3000'; // Android Emulator
// const API_BASE_URL = 'http://localhost:3000'; // iOS Simulator
const API_BASE_URL = 'http://192.168.4.156:3000'; // Para dispositivo físico (Substitua o IP para o SEU IP local)

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Serviços de autenticação
export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  
  logout: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  }
};

// Serviços de pratos
export const pratosService = {
  listar: async () => {
    const response = await api.get('/pratos');
    return response.data;
  },
  
  buscarPorId: async (id) => {
    const response = await api.get(`/pratos/${id}`);
    return response.data;
  },
  
  criar: async (prato) => {
    const response = await api.post('/pratos', prato);
    return response.data;
  },
  
  atualizar: async (id, prato) => {
    const response = await api.put(`/pratos/${id}`, prato);
    return response.data;
  },
  
  deletar: async (id) => {
    const response = await api.delete(`/pratos/${id}`);
    return response.data;
  },
  
  buscar: async (nome, categoria) => {
    const params = {};
    if (nome) params.nome = nome;
    if (categoria) params.categoria = categoria;
    
    const response = await api.get('/pratos/search', { params });
    return response.data;
  }
};

export default api;