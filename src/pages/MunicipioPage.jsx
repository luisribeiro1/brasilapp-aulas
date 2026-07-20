import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { http } from '../api/brasilapp'
import BotaoFavorito from '../components/BotaoFavorito'
import {
  Apple, Bean, Carrot, Cherry, CircleDot, Citrus, Coffee, 
  Droplets, Flower, Flower2, Grape, Leaf, Nut, Scissors, Shrub, 
  Sprout, Sun, TreePalm, Wheat
} from 'lucide-react'

const fmt = (n) => n?.toLocaleString('pt-BR') ?? '-'
const pct = (a, b) => b ? (a / b * 100).toFixed(1) : '0'

const PRODUTO_ICONES = {
  'Abacate':                        Cherry,
  'Abacaxi*':                       Citrus,
  'Açaí':                           Grape,
  'Algodão herbáceo (em caroço)':   Flower2,
  'Alho':                           CircleDot,
  'Amendoim (em casca)':            Nut,
  'Arroz (em casca)':               Wheat,
  'Aveia (em grão)':                Wheat,
  'Azeitona':                       Cherry,
  'Banana (cacho)':                 Citrus,
  'Batata-doce':                    Carrot,
  'Batata-inglesa':                 Carrot,
  'Borracha (látex coagulado)':     Droplets,
  'Cacau (em amêndoa)':             Bean,
  'Café (em grão) Total':           Coffee,
  'Café (em grão) Arábica':         Coffee,
  'Café (em grão) Canephora':       Coffee,
  'Cana-de-açúcar':                 Sprout,
  'Caqui':                          Apple,
  'Castanha de caju':               Nut,
  'Cebola':                         CircleDot,
  'Centeio (em grão)':              Wheat,
  'Cevada (em grão)':               Wheat,
  'Chá-da-índia (folha verde)':     Leaf,
  'Coco-da-baía*':                  TreePalm,
  'Dendê (cacho de coco)':          TreePalm,
  'Erva-mate (folha verde)':        Leaf,
  'Ervilha (em grão)':              Bean,
  'Fava (em grão)':                 Bean,
  'Feijão (em grão)':               Bean,
  'Figo':                           Apple,
  'Fumo (em folha)':                Leaf,
  'Girassol (em grão)':             Sun,
  'Goiaba':                         Apple,
  'Guaraná (semente)':              Bean,
  'Juta (fibra)':                   Scissors,
  'Laranja':                        Citrus,
  'Limão':                          Citrus,
  'Linho (semente)':                Bean,
  'Maçã':                           Apple,
  'Malva (fibra)':                  Flower2,
  'Mamão':                          Apple,
  'Mamona (baga)':                  Shrub,
  'Mandioca':                       Carrot,
  'Manga':                          Apple,
  'Maracujá':                       Flower,
  'Marmelo':                        Apple,
  'Melancia':                       Cherry,
  'Melão':                          Cherry,
  'Milho (em grão)':                Wheat,
  'Noz (fruto seco)':               Nut,
  'Palmito':                        TreePalm,
  'Pera':                           Apple,
  'Pêssego':                        Cherry,
  'Pimenta-do-reino':               CircleDot,
  'Sisal ou agave (fibra)':         Shrub,
  'Soja (em grão)':                 Sprout,
  'Sorgo (em grão)':                Wheat,
  'Tangerina':                      Citrus,
  'Tomate':                         Cherry,
  'Trigo (em grão)':                Wheat,
  'Triticale (em grão)':            Wheat,
  'Tungue (fruto seco)':            Nut,
  'Urucum (semente)':               Flower,
  'Uva':                            Grape,
}

const CARDS = [
  { label: 'População',  campo: 'populacao_2022', icon: 'bi-people-fill',   cor: 'primary' },
  { label: 'Homens',     campo: 'homens',          icon: 'bi-gender-male',   cor: 'info'    },
  { label: 'Mulheres',   campo: 'mulheres',        icon: 'bi-gender-female', cor: 'danger'  },
  { label: 'Urbana',     campo: 'urbana',          icon: 'bi-buildings',     cor: 'warning' },
  { label: 'Rural',      campo: 'rural',           icon: 'bi-tree',          cor: 'success' },
]


export default function MunicipioPage() {
  const { id } = useParams()
  const [municipio, setMunicipio] = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [erro,      setErro]      = useState(null)
  const [producao,  setProducao]  = useState([])

  useEffect(() => {
    async function carregar() {
      try {
        const resMunicipio = await http.get(`/municipios/${id}`)
        setMunicipio(resMunicipio.data)

        const resProducao = await http.get(`/municipios/${id}/producao`).catch(() => [])
        setProducao(resProducao.data)
      } catch (e) {
        setErro(e.message)
      } finally {
        setLoading(false)
      }
    }
    carregar()
  }, [id])

  if (loading) return <div className="text-center py-5"><div className="spinner-border text-primary" /></div>
  if (erro)    return <div className="alert alert-danger">{erro}</div>
  if (!municipio) return <div className="alert alert-warning">Município não encontrado.</div>

  return (
    <div>
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Brasil</Link></li>
          <li className="breadcrumb-item"><Link to={`/estados/${municipio.uf}`}>{municipio.uf}</Link></li>
          <li className="breadcrumb-item active">{municipio.municipio}</li>
        </ol>
      </nav>

      {/* Cabeçalho */}
      <div className="page-hero d-flex justify-content-between align-items-start">
        <div>
          <small className="opacity-75"><i className="bi bi-geo-alt me-1"></i>{municipio.uf} · Censo 2022</small>
          <h1 className="display-6 fw-bold mb-0">{municipio.municipio}</h1>
        </div>
        <BotaoFavorito tipo="municipio" id={municipio.id} nome={municipio.municipio} />
      </div>

      {/* Cards de estatísticas */}
      <div className="row g-3 mb-4">
        {CARDS.map(({ label, campo, icon, cor }) => (
          <div key={campo} className="col-6 col-md-4 col-lg">
            <div className="card h-100">
              <div className="card-body">
                <i className={`bi ${icon} text-${cor} fs-4`}></i>
                <p className="text-muted small mb-1 mt-2">{label}</p>
                <p className="fw-bold mb-0">
                  {fmt(municipio[campo])}
                  {campo !== 'populacao_2022' && <span className="text-muted fw-normal small ms-1">({pct(municipio[campo], municipio.populacao_2022)}%)</span>}
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
                <span><i className="bi bi-gender-male text-info"></i> Homens {pct(municipio.homens, municipio.populacao_2022)}%</span>
                <span>{pct(municipio.mulheres, municipio.populacao_2022)}% Mulheres <i className="bi bi-gender-female text-danger"></i></span>
              </div>
              <div className="progress">
                <div className="progress-bar bg-info"   style={{ width: `${pct(municipio.homens, municipio.populacao_2022)}%` }} />
                <div className="progress-bar bg-danger" style={{ width: `${pct(municipio.mulheres, municipio.populacao_2022)}%` }} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <div className="d-flex justify-content-between small mb-1">
                <span><i className="bi bi-buildings text-warning"></i> Urbana {pct(municipio.urbana, municipio.populacao_2022)}%</span>
                <span>{pct(municipio.rural, municipio.populacao_2022)}% Rural <i className="bi bi-tree text-success"></i></span>
              </div>
              <div className="progress">
                <div className="progress-bar bg-warning" style={{ width: `${pct(municipio.urbana, municipio.populacao_2022)}%` }} />
                <div className="progress-bar bg-success" style={{ width: `${pct(municipio.rural, municipio.populacao_2022)}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Produção Agrícola */}
      {producao.length > 0 && (
        <>
          <h4 className="fw-bold mb-3">
            <i className="bi bi-flower1 text-success me-2"></i>
            Produção Agrícola
          </h4>
          <div className="row g-3 mb-4">
            {producao.map(({ produto, quantidade }) => {
              const Icon = PRODUTO_ICONES[produto] ?? Sprout
              return (
                <div key={produto} className="col-6 col-md-4 col-lg-3">
                  <div className="card h-100">
                    <div className="card-body d-flex align-items-center">
                      <Icon size={28} className="text-success me-3 flex-shrink-0" />
                      <div>
                        <p className="text-muted small mb-0">{produto}</p>
                        <p className="fw-bold mb-0">{fmt(quantidade)} <span className="text-muted fw-normal small">toneladas</span></p>
                      </div>
                    </div>
                  </div>
                </div>
              ) 
            })}
          </div>
          <p className="text-muted small">Fonte: IBGE - Produção Agrícola Municipal - 2024</p>
        </>
      )}

    </div>
  )
}
