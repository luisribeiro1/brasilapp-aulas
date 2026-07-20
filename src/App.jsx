import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import EstadoPage from './pages/EstadoPage'
import MunicipioPage from './pages/MunicipioPage'
import FavoritosPage from './pages/FavoritosPage'
import ExemploUseEffect from './pages/ExemploUseEffect'

export default function App() {
  return (
    <>
      <Header />
      <div className="container py-4">
        <Routes>
          <Route path="/"                element={<Dashboard />} />
          <Route path="/estados/:uf"     element={<EstadoPage />} />
          <Route path="/municipios/:id"  element={<MunicipioPage />} />
          <Route path="/favoritos"       element={<FavoritosPage />} />
          <Route path="/useeffect"      element={<ExemploUseEffect />} />
        </Routes>
      </div>
    </>
  )
}
