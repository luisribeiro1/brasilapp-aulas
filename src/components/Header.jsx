import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <nav className="navbar navbar-dark navbar-brasilapp">
      <div className="container justify-content-between">
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <i className="bi bi-globe-americas fs-5 me-2"></i>
          <span>BrasilApp</span>
          {/* <small className="ms-2 fw-normal opacity-75">Censo 2022 · IBGE</small> */}
        </Link>
        <div className="d-flex gap-2">
          <Link to="/favoritos" className="btn btn-outline-light btn-sm">
            <i className="bi bi-star me-1"></i>Favoritos
          </Link>
          <Link to="/useeffect" className="btn btn-outline-light btn-sm">
            <i className="bi bi-lightbulb me-1"></i>useEffect
          </Link>
        </div>
      </div>
    </nav>
  )
}
