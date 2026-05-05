import { ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearAuth, isAuthenticated } from '../../api/requests'

interface BizShellProps {
  children: ReactNode
  /** Mostra os atalhos da loja (Promoções, Loja, Sobre, Contato) — usar só na home */
  showStoreNav?: boolean
  /** Atalhos de admin (Adicionar / Upload / Devedores) */
  isAdmin?: boolean
}

export default function BizShell({
  children,
  showStoreNav = false,
  isAdmin = false,
}: BizShellProps) {
  const navigate = useNavigate()
  const authed = isAuthenticated()

  const handleLogout = () => {
    clearAuth()
    navigate('/')
  }

  return (
    <div className="biz">
      <header className="biz-header">
        <div className="biz-header__top">
          <Link to="/" className="biz-header__brand-link">
            <div className="biz-header__brand">
              <span className="biz-header__star">✿</span>
              <h1 className="biz-header__name">Dora Modas</h1>
              <span className="biz-header__star">✿</span>
            </div>
          </Link>
          <p className="biz-header__slogan">
            <i>~ Roupas femininas com carinho desde 1996 ~</i>
          </p>
          <p className="biz-header__addr">
            Rua Salgueiro do Campo, 505 · São Paulo/SP · CEP 05814-210 · Tel: (11) 91685-0647
          </p>
        </div>

        <nav className="biz-nav">
          {showStoreNav ? (
            <>
              <a href="#promocoes">Promoções</a>
              <span>|</span>
              <a href="#produtos">Nossa loja</a>
              <span>|</span>
              <a href="#sobre">Sobre a Dora</a>
              <span>|</span>
              <a href="#contato">Como chegar</a>
              <span>|</span>
            </>
          ) : (
            <>
              <Link to="/">Voltar à loja</Link>
              <span>|</span>
            </>
          )}

          {isAdmin && (
            <>
              <Link to="/add-item">Adicionar peça</Link>
              <span>|</span>
              <Link to="/upload-image">Upload de fotos</Link>
              <span>|</span>
              <Link to="/debtors">Devedores</Link>
              <span>|</span>
            </>
          )}

          {authed ? (
            <button
              type="button"
              className="biz-nav__link"
              onClick={handleLogout}
            >
              Sair
            </button>
          ) : (
            <Link to="/login">Entrar</Link>
          )}
        </nav>
      </header>

      {children}

      <footer className="biz-footer">
        <p>
          © 2026 — <b>Dora Modas</b> — Todos os direitos reservados.
        </p>
        <p className="biz-footer__small">
          <i>Site feito com carinho 💖 — melhor visualizado em 1024x768</i>
        </p>
        <p className="biz-footer__small">
          <a href="#">Topo da página ↑</a>
        </p>
      </footer>
    </div>
  )
}
