import { useFavoritos } from '../hooks/useFavoritos'

export default function BotaoFavorito({ tipo, id, nome }) {
  const { isFavorito, alternar } = useFavoritos()
  const fav = isFavorito(id)

  return (
    <button
      className={`btn btn-sm ${fav ? 'btn-warning' : 'btn-outline-light'}`}
      onClick={() => alternar({ tipo, id, nome })}
    >
      <i className={`bi ${fav ? 'bi-star-fill' : 'bi-star'} me-1`}></i>
      Favorito
    </button>
  )
}
