import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './LoginPage.css'
import { loginUser } from '../../api/requests'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import BizShell from '../../components/BizShell/BizShell'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    const wasRemembered = localStorage.getItem('rememberMe') === 'true'
    if (savedEmail && wasRemembered) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha todos os campos')
      setShowErrorModal(true)
      return
    }

    setIsLoading(true)
    try {
      await loginUser(email, password)
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
        localStorage.setItem('rememberMe', 'true')
      } else {
        localStorage.removeItem('rememberedEmail')
        localStorage.removeItem('rememberMe')
      }
      navigate('/')
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro desconhecido'
      setErrorMessage(errorMsg)
      setShowErrorModal(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BizShell>
      <section className="biz-section">
        <h2 className="biz-h2">★ Bem-vinda de volta! ★</h2>
        <hr className="biz-hr" />
        <p className="biz-lead">
          Entra na sua conta pra ver pedidos, fechar comprinha e bater papo com a Dora 💬
        </p>

        <div className="biz-box biz-box--rosa biz-box--narrow">
          <form className="biz-form" onSubmit={handleSubmit}>
            <div className="biz-form__group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                className="biz-input"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="biz-form__group">
              <label htmlFor="password">Senha</label>
              <input
                type="password"
                id="password"
                className="biz-input"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="biz-inline">
              <label className="biz-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                Lembrar de mim
              </label>
              <Link to="#">Esqueceu a senha?</Link>
            </div>

            <div className="biz-form__actions">
              <Link to="/" className="biz-btn">← Voltar pra loja</Link>
              <button type="submit" className="biz-btn biz-btn--rosa" disabled={isLoading}>
                {isLoading ? 'Entrando...' : '✿ Entrar'}
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: '0.6rem' }}>
              Não tem uma conta? <Link to="/signup">Cadastre-se aqui »</Link>
            </p>
          </form>
        </div>
      </section>

      <ErrorAuthModal
        isOpen={showErrorModal}
        onClose={() => { setShowErrorModal(false); setErrorMessage('') }}
        message={errorMessage}
      />
    </BizShell>
  )
}
