import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { api } from '../api/brasilapp'
import { PRODUTO_ICONES } from '../utils/produtoIcones'

const fmt = (n) => n?.toLocaleString('pt-BR') ?? '-'

export default function ProdutoPage() {
  const { produto } = useParams()
  const [produtores, setProdutores] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [erro,       setErro]       = useState(null)

  useEffect(() => {
    setLoading(true)
    api.topProdutores(produto)
      .then(setProdutores)
      .catch(e => setErro(e.message))
      .finally(() => setLoading(false))
  }, [produto])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (erro)    return <div className="alert alert-danger">{erro}</div>

  const Icon = PRODUTO_ICONES[produto] ?? Sprout

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Brasil</Link></li>
          <li className="breadcrumb-item active">Produção Agrícola</li>
        </ol>
      </nav>

      {/* Cabeçalho */}
      <div className="page-hero">
        <small className="opacity-75"><i className="bi bi-flower1 me-1"></i>Produção Agrícola · 2024</small>
        <h1 className="display-6 fw-bold mb-0 d-flex align-items-center gap-2">
          <Icon size={40} />
          {produto}
        </h1>
      </div>

      {produtores.length === 0 ? (
        <div className="alert alert-warning">Nenhum município produtor encontrado para este produto.</div>
      ) : (
        <div className="card">
          <div className="card-header">
            <strong>Os {produtores.length} maiores municípios produtores do Brasil</strong>
          </div>
          <div className="table-responsive">
            <table className="table table-hover table-sm mb-0">
              <thead className="table-light">
                <tr>
                  <th className="text-center">#</th>
                  <th>Município</th>
                  <th>UF</th>
                  <th className="text-end">Quantidade (toneladas)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {produtores.map((p, i) => (
                  <tr key={p.id}>
                    <td className="text-center text-muted">{i + 1}º</td>
                    <td>{p.municipio}</td>
                    <td>
                      <Link to={`/estados/${p.uf}`}>{p.uf}</Link>
                    </td>
                    <td className="text-end fw-bold text-success">{fmt(p.quantidade)}</td>
                    <td className="text-end">
                      <Link to={`/municipios/${p.id}`} className="btn btn-outline-primary btn-sm">→</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p className="text-muted small mt-3">Fonte: IBGE - Produção Agrícola Municipal - 2024</p>
    </div>
  )
}
