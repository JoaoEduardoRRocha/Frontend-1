import './SignupPage.css'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signupUser } from '../../api/requests'
import BizShell from '../../components/BizShell/BizShell'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    age: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.passwordConfirmation) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }
      if (formData.password !== formData.passwordConfirmation) {
        throw new Error('As senhas não coincidem. Por favor, verifique.')
      }
      if (formData.password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres')
      }

      await signupUser(formData.name, formData.email, formData.password, formData.passwordConfirmation)
      alert('Cadastro realizado com sucesso! Faça login para continuar.')
      navigate('/login')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar conta'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BizShell>
      <section className="biz-section">
        <h2 className="biz-h2">✿ Faça seu cadastro ✿</h2>
        <hr className="biz-hr" />
        <p className="biz-lead">
          Cadastre-se e deixe a Dora te conhecer pelo nome 💖
        </p>

        <div className="biz-box biz-box--rosa biz-box--narrow">
          {error && <div className="biz-error">{error}</div>}

          <form className="biz-form" onSubmit={handleSubmit}>
            <div className="biz-form__group">
              <label htmlFor="name">Nome completo</label>
              <input
                type="text"
                id="name"
                name="name"
                className="biz-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Digite seu nome completo"
                required
              />
            </div>

            <div className="biz-form__group">
              <label htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                name="email"
                className="biz-input"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Digite seu e-mail"
                required
              />
            </div>

            <div className="biz-form__row">
              <div className="biz-form__group">
                <label htmlFor="password">Senha</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="biz-input"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              <div className="biz-form__group">
                <label htmlFor="passwordConfirmation">Confirmar senha</label>
                <input
                  type="password"
                  id="passwordConfirmation"
                  name="passwordConfirmation"
                  className="biz-input"
                  value={formData.passwordConfirmation}
                  onChange={handleInputChange}
                  placeholder="Repita a senha"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="biz-form__group">
              <label htmlFor="age">Idade</label>
              <input
                type="number"
                id="age"
                name="age"
                className="biz-input"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Digite sua idade"
                required
                min={13}
                max={120}
              />
            </div>

            <div className="biz-form__actions">
              <Link to="/login" className="biz-btn">← Já tenho conta</Link>
              <button type="submit" className="biz-btn biz-btn--rosa" disabled={isLoading}>
                {isLoading ? 'Criando...' : '✿ Criar conta'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </BizShell>
  )
}
