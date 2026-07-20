import { useState } from 'react'

// Favorito: { tipo: 'estado' | 'municipio', id, nome }
// Para estados o id é a própria UF (ex.: 'SP').
export function useFavoritos() {
  const [favoritos, setFavoritos] = useState(
    () => JSON.parse(localStorage.getItem('favoritos')) ?? []
  )

  const isFavorito = (id) => favoritos.some(f => f.id === id)

  // Adiciona se não existe, remove se já existe
  const alternar = (fav) => {
    const lista = isFavorito(fav.id)
      ? favoritos.filter(f => f.id !== fav.id)
      : [...favoritos, fav]
    localStorage.setItem('favoritos', JSON.stringify(lista))
    setFavoritos(lista)
  }

  return { favoritos, isFavorito, alternar }
}
