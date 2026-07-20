import { Link } from 'react-router-dom'
import { useFavoritos } from '../hooks/useFavoritos'

export default function FavoritosPage() {
  const { favoritos, alternar } = useFavoritos()

  return (
    <div>
      <div className="page-hero">
        <h1 className="display-6 fw-bold mb-0"><i className="bi bi-star-fill me-2"></i>Favoritos</h1>
      </div>

      {favoritos.length === 0 && (
        <div className="alert alert-info">
          Nenhum favorito ainda. Abra um estado ou município e clique em "Favorito".
        </div>
      )}

      <ul className="list-group">
        {favoritos.map(f => (
          <li key={f.id} className="list-group-item d-flex justify-content-between align-items-center">
            <Link to={f.tipo === 'estado' ? `/estados/${f.id}` : `/municipios/${f.id}`}>
              {f.nome}
            </Link>
            <button className="btn btn-outline-danger btn-sm" onClick={() => alternar(f)}>
              <i className="bi bi-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
