import axios from 'axios'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

// Desempacota a resposta do axios: cada requisição passa a retornar
// diretamente o corpo da API (res.data), evitando o padrão `data.data`.
// http.interceptors.response.use((res) => res.data)
