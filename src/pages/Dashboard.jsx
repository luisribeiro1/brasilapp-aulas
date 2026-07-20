import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { http } from '../api/brasilapp'

// const fmt = (n) => n?.toLocaleString('pt-BR') ?? '-'
function formatarDecimal(n) {
  // if (n === null || n === undefined) {
  //   return '-';
  // }
  return n.toLocaleString('pt-BR');
}

const COR_REGIAO = {
  'Norte': 'success-subtle', 'Nordeste': 'warning-subtle', 'Centro-Oeste': 'info-subtle', 'Sudeste': 'primary-subtle', 'Sul': 'secondary-subtle',
}

export default function Dashboard() {
  const [estados, setEstados]   = useState([])
  const [loading, setLoading]   = useState(true)
  const [erro, setErro]         = useState(null)
  const [busca, setBusca]       = useState('')

  const valor1 = formatarDecimal(1234567.89)   // "1.234.567"
console.log(valor1)

// Função tradicional
// function dobro(n) {
//   return n * 2;
// }

// Arrow function equivalente
// const dobro2 = (n) => n * 2;


// // Teste de map e array
// const caixas = [
//   { id: 1, nome: "Caixa A" },
//   { id: 2, nome: "Caixa B" }
// ]
// const resultado = caixas.map(caixa => {
//   console.log(caixa.nome)
//   console.log(caixa)
// })




  useEffect(() => {
    async function carregar() {
      try {
        const { data } = await http.get('/estados')
        setEstados(data)
      } catch (e) {
        setErro(e.message)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (erro)    return <div className="alert alert-danger">{erro}</div>

  const filtrados = estados.filter(objEstado =>
    objEstado.estado.includes(busca) ||
    objEstado.uf.includes(busca)
  )

  // const filtrados = estados.filter(e =>
  //   e.estado.toLowerCase().includes(busca.toLowerCase()) ||
  //   e.uf.toLowerCase().includes(busca.toLowerCase())
  // )

//   console.log( filtrados.map(estado => estado.uf) )
// // ["SP", "RJ", "MG", ...]  → a expressão TEM um valor

// console.log( filtrados.forEach(estado => estado.uf) )
// // undefined  → a expressão NÃO tem valor útil



  return (
    <div>
      <h2 className="mb-1">Brasil · Censo 2022</h2>
      <p className="text-muted mb-4">Dados populacionais por estado e município · IBGE</p>

      <input
        className="form-control mb-4"
        placeholder="Buscar por estado ou UF..."
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3"> 
        {filtrados.map(estado => (
            <div key={estado.uf} className="col">
              <Link to={`/estados/${estado.uf}`} className="card h-100 text-decoration-none">
                <div className="card-body">

                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4 className="mb-0 fw-bold">{estado.uf}</h4>
                    <span className={`badge bg-${COR_REGIAO[estado.regiao] ?? 'light'}`}>{estado.regiao ?? '—'}</span>
                  </div>

                  <p className="text-muted small mb-2">{estado.estado}</p>

                  <p className="mb-3">
                    <i className="bi bi-people-fill text-primary me-1"></i>
                    <strong>{formatarDecimal(estado.populacao_2022)}</strong> hab.
                  </p>

                  {/* Barra sexo */}
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span><i className="bi bi-gender-male text-info"></i> {formatarDecimal(estado.homens, estado.populacao_2022)}% homens</span>
                    <span>{formatarDecimal(estado.mulheres, estado.populacao_2022)}% mulheres <i className="bi bi-gender-female text-danger"></i></span>
                  </div>
                  <div className="progress mb-3">
                    <div className="progress-bar bg-info"   style={{ width: `${formatarDecimal(estado.homens, estado.populacao_2022)}%` }} />
                    <div className="progress-bar bg-danger" style={{ width: `${formatarDecimal(estado.mulheres, estado.populacao_2022)}%` }} />
                  </div>

                  {/* Barra residência */}
                  <div className="d-flex justify-content-between small text-muted mb-1">
                    <span><i className="bi bi-buildings text-warning"></i> {formatarDecimal(estado.urbana, estado.populacao_2022)}% urbana</span>
                    <span>{formatarDecimal(estado.rural, estado.populacao_2022)}% rural <i className="bi bi-tree text-success"></i></span>
                  </div>
                  <div className="progress">
                    <div className="progress-bar bg-warning" style={{ width: `${formatarDecimal(estado.urbana, estado.populacao_2022)}%` }} />
                    <div className="progress-bar bg-success" style={{ width: `${formatarDecimal(estado.rural, estado.populacao_2022)}%` }} />
                  </div>

                </div>
              </Link>
            </div>
          ))}
      </div>

      {filtrados.length === 0 && <p className="text-muted text-center mt-4">Nenhum estado encontrado.</p>}
    </div>
  )
}
