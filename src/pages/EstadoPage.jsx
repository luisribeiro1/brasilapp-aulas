import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { http } from '../api/brasilapp'
import BotaoFavorito from '../components/BotaoFavorito'

const fmt = (n) => n?.toLocaleString('pt-BR') ?? '-'
const pct = (a, b) => b ? (a / b * 100).toFixed(1) : '0'

const CARDS = [
  { label: 'População',  campo: 'populacao_2022', icon: 'bi-people-fill',   cor: 'primary' },
  { label: 'Homens',     campo: 'homens',          icon: 'bi-gender-male',   cor: 'info'    },
  { label: 'Mulheres',   campo: 'mulheres',        icon: 'bi-gender-female', cor: 'danger'  },
  { label: 'Urbana',     campo: 'urbana',          icon: 'bi-buildings',     cor: 'warning' },
  { label: 'Rural',      campo: 'rural',           icon: 'bi-tree',          cor: 'success' },
]

export default function EstadoPage() {
  const { uf } = useParams()
  const [estado,     setEstado]     = useState(null)
  const [municipios, setMunicipios] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [erro,       setErro]       = useState(null)
  const [busca,      setBusca]      = useState('')
  const [ordem,      setOrdem]      = useState({ campo: 'municipio', dir: 'asc' })

  useEffect(() => {
    setLoading(true)
    setBusca('')
    setOrdem({ campo: 'municipio', dir: 'asc' })
    async function carregar() {
      try {
        const [resEstado, resMunicipios] = await Promise.all([
          http.get('/estados', { params: { uf: uf.toUpperCase() } }),
          http.get('/municipios', { params: { uf: uf.toUpperCase() } }),
        ])
        setEstado(resEstado.data[0] ?? null)
        setMunicipios(resMunicipios.data)
      } catch (e) {
        setErro(e.message)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [uf])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (erro)    return <div className="alert alert-danger">{erro}</div>
  if (!estado) return <div className="alert alert-warning">Estado não encontrado.</div>

  const filtrados = municipios
    .filter(m => m.municipio.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      const va = a[ordem.campo] ?? '', vb = b[ordem.campo] ?? ''
      const cmp = typeof va === 'string' ? va.localeCompare(vb, 'pt-BR') : va - vb
      return ordem.dir === 'asc' ? cmp : -cmp
    })

  const ordenarPor = (campo) =>
    setOrdem(prev => ({ campo, dir: prev.campo === campo && prev.dir === 'asc' ? 'desc' : 'asc' }))

  const Th = ({ campo, label }) => (
    <th style={{ cursor: 'pointer' }} onClick={() => ordenarPor(campo)}>
      {label} {ordem.campo === campo ? (ordem.dir === 'asc' ? '↑' : '↓') : ''}
    </th>
  )

  return (
    <div>
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-3">← Todos os estados</Link>

      {/* Cabeçalho */}
      <div className="page-hero d-flex justify-content-between align-items-start">
        <div>
          <h1 className="display-6 fw-bold mb-0">{estado.uf} · {estado.estado}</h1>
          <small className="opacity-75">{municipios.length} municípios · Censo 2022</small>
        </div>
        <BotaoFavorito tipo="estado" id={estado.uf} nome={estado.estado} />
      </div>

      {/* Cards de estatísticas */}
      <div className="row g-3 mb-4">
        {CARDS.map(({ label, campo, icon, cor }) => (
          <div key={campo} className=" col-lg">
            <div className="card h-100">
              <div className="card-body">
                <i className={`bi ${icon} text-${cor} fs-4`}></i>
                <p className="text-muted small mb-1 mt-2">{label}</p>
                <p className="fw-bold mb-0">
                  {fmt(estado[campo])}
                  {campo !== 'populacao_2022' && <span className="text-muted fw-normal small ms-1">({pct(estado[campo], estado.populacao_2022)}%)</span>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Barras de proporção */}
      <div className="row g-3 mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between small mb-1">
                <span><i className="bi bi-gender-male text-info"></i> Homens {pct(estado.homens, estado.populacao_2022)}%</span>
                <span>{pct(estado.mulheres, estado.populacao_2022)}% Mulheres <i className="bi bi-gender-female text-danger"></i></span>
              </div>
              <div className="progress">
                <div className="progress-bar bg-info"   style={{ width: `${pct(estado.homens, estado.populacao_2022)}%` }} />
                <div className="progress-bar bg-danger" style={{ width: `${pct(estado.mulheres, estado.populacao_2022)}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between small mb-1">
                <span><i className="bi bi-buildings text-warning"></i> Urbana {pct(estado.urbana, estado.populacao_2022)}%</span>
                <span>{pct(estado.rural, estado.populacao_2022)}% Rural <i className="bi bi-tree text-success"></i></span>
              </div>
              <div className="progress">
                <div className="progress-bar bg-warning" style={{ width: `${pct(estado.urbana, estado.populacao_2022)}%` }} />
                <div className="progress-bar bg-success" style={{ width: `${pct(estado.rural, estado.populacao_2022)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de municípios */}
      <div className="card">
        <div className="card-header d-flex flex-wrap gap-2 justify-content-between align-items-center">
          <strong>Municípios ({filtrados.length})</strong>
          <input
            className="form-control form-control-sm w-auto"
            placeholder="Buscar município..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="table table-hover table-sm mb-0">
            <thead className="table-light">
              <tr>
                <Th campo="municipio"     label="Município"  />
                <Th campo="populacao_2022" label="População" />
                <Th campo="homens"        label="Homens"     />
                <Th campo="mulheres"      label="Mulheres"   />
                <Th campo="urbana"        label="Urbana"     />
                <Th campo="rural"         label="Rural"      />
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map(m => (
                <tr key={m.id}>
                  <td>{m.municipio}</td>
                  <td>{fmt(m.populacao_2022)}</td>
                  <td className="text-info">{fmt(m.homens)}</td>
                  <td className="text-danger">{fmt(m.mulheres)}</td>
                  <td className="text-primary">{fmt(m.urbana)}</td>
                  <td className="text-success">{fmt(m.rural)}</td>
                  <td>
                    <Link to={`/municipios/${m.id}`} className="btn btn-outline-primary btn-sm">→</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtrados.length === 0 && <p className="text-muted text-center p-3">Nenhum município encontrado.</p>}
        </div>
      </div>
    </div>
  )
}
