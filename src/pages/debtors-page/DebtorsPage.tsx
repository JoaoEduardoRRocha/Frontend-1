import './DebtorsPage.css'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { isAuthenticated, isAdmin } from '../../api/requests'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import Loading from '../../components/Loading/Loading'
import BizShell from '../../components/BizShell/BizShell'

interface Debtor {
  id: string
  name: string
  amount: number
  description: string
  date: string
  createdAt: string
}

const STORAGE_KEY = 'debtors-list'

export default function DebtorsPage() {
  const navigate = useNavigate()
  const [debtors, setDebtors] = useState<Debtor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        const isAuth = isAuthenticated()
        setUserIsAuthenticated(isAuth)
        if (!isAuth) {
          setError('Você precisa estar logado para acessar esta página')
          setShowErrorModal(true)
          return
        }
        const adminStatus = await isAdmin()
        setUserIsAdmin(adminStatus)
        if (!adminStatus) {
          setError('Apenas administradores podem acessar esta página')
          setShowErrorModal(true)
          return
        }
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) setDebtors(JSON.parse(stored))
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar dados'
        setError(errorMessage)
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (userIsAdmin) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(debtors))
    }
  }, [debtors, userIsAdmin])

  const handleCloseErrorModal = () => {
    setShowErrorModal(false)
    if (!userIsAuthenticated || !userIsAdmin) navigate('/')
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.amount.trim()) {
      setError('Por favor, preencha pelo menos o nome e o valor')
      setShowErrorModal(true)
      return
    }
    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      setError('O valor deve ser um número maior que zero')
      setShowErrorModal(true)
      return
    }

    if (editingId) {
      setDebtors(prev => prev.map(d =>
        d.id === editingId
          ? { ...d, name: formData.name.trim(), amount, description: formData.description.trim(), date: formData.date }
          : d
      ))
    } else {
      const newDebtor: Debtor = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        amount,
        description: formData.description.trim(),
        date: formData.date,
        createdAt: new Date().toISOString()
      }
      setDebtors(prev => [...prev, newDebtor])
    }

    setFormData({ name: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
    setEditingId(null)
  }

  const handleEdit = (d: Debtor) => {
    setFormData({ name: d.name, amount: d.amount.toString(), description: d.description, date: d.date })
    setEditingId(d.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este registro?')) {
      setDebtors(prev => prev.filter(d => d.id !== id))
    }
  }

  const handleCancel = () => {
    setFormData({ name: '', amount: '', description: '', date: new Date().toISOString().split('T')[0] })
    setShowForm(false)
    setEditingId(null)
  }

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
  const formatDate = (s: string) => new Date(s).toLocaleDateString('pt-BR')

  const totalDebt = debtors.reduce((sum, d) => sum + d.amount, 0)

  if (isLoading) {
    return (
      <BizShell isAdmin={userIsAdmin}>
        <section className="biz-section" style={{ textAlign: 'center' }}>
          <Loading isVisible={true} />
        </section>
      </BizShell>
    )
  }

  if (!userIsAuthenticated || !userIsAdmin) {
    return (
      <BizShell isAdmin={false}>
        <section className="biz-section">
          <div className="biz-box biz-box--rosa biz-box--narrow" style={{ textAlign: 'center' }}>
            <h2 className="biz-h2 biz-h2--small">Acesso negado</h2>
            <hr className="biz-hr" />
            <p>{error || 'Apenas administradores podem ver os devedores.'}</p>
          </div>
        </section>
        <ErrorAuthModal
          isOpen={showErrorModal}
          onClose={handleCloseErrorModal}
          message={error || 'Acesso negado'}
        />
      </BizShell>
    )
  }

  return (
    <BizShell isAdmin>
      <section className="biz-section">
        <h2 className="biz-h2">📝 Caderninho de devedores</h2>
        <hr className="biz-hr" />
        <p className="biz-lead">
          Anote quem comprou fiado e quanto está devendo. Tudo guardado aqui no navegador.
        </p>

        <div className="biz-summary">
          <div className="biz-summary__card">
            <span className="biz-summary__label">Total de devedores</span>
            <span className="biz-summary__value">{debtors.length}</span>
          </div>
          <div className="biz-summary__card">
            <span className="biz-summary__label">Valor total</span>
            <span className="biz-summary__value biz-summary__value--dinheiro">
              {formatCurrency(totalDebt)}
            </span>
          </div>
        </div>

        {!showForm && (
          <p style={{ textAlign: 'center', margin: '1rem 0' }}>
            <button
              type="button"
              className="biz-btn biz-btn--rosa"
              onClick={() => setShowForm(true)}
            >
              ➕ Adicionar novo devedor
            </button>
          </p>
        )}

        {showForm && (
          <div className="biz-box biz-box--rosa">
            <h3 className="biz-h3">{editingId ? '✏️ Editar devedor' : '➕ Novo devedor'}</h3>
            <form className="biz-form" onSubmit={handleSubmit}>
              <div className="biz-form__group">
                <label htmlFor="name">Nome *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="biz-input"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nome da pessoa"
                  required
                />
              </div>

              <div className="biz-form__row">
                <div className="biz-form__group">
                  <label htmlFor="amount">Valor (R$) *</label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    className="biz-input"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="biz-form__group">
                  <label htmlFor="date">Data</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    className="biz-input"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="biz-form__group">
                <label htmlFor="description">Observações</label>
                <textarea
                  id="description"
                  name="description"
                  className="biz-textarea"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="O que comprou, combinação de pagamento..."
                  rows={3}
                />
              </div>

              <div className="biz-form__actions">
                <button type="button" className="biz-btn" onClick={handleCancel}>Cancelar</button>
                <button type="submit" className="biz-btn biz-btn--rosa">
                  {editingId ? 'Salvar alterações' : 'Adicionar'}
                </button>
              </div>
            </form>
          </div>
        )}
      </section>

      <section className="biz-section">
        <h2 className="biz-h2 biz-h2--small">Lista de devedores</h2>
        <hr className="biz-hr" />

        {debtors.length === 0 ? (
          <div className="biz-empty">
            <p>📋 <b>Nenhum devedor cadastrado ainda.</b></p>
            <p>Clique em "Adicionar novo devedor" pra começar.</p>
          </div>
        ) : (
          <table className="biz-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Valor</th>
                <th>Data</th>
                <th>Observações</th>
                <th style={{ width: '8rem' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {debtors.map(d => (
                <tr key={d.id}>
                  <td><b>{d.name}</b></td>
                  <td style={{ color: 'var(--rosa-forte)', fontWeight: 'bold' }}>
                    {formatCurrency(d.amount)}
                  </td>
                  <td>📅 {formatDate(d.date)}</td>
                  <td>{d.description || <i>—</i>}</td>
                  <td>
                    <button
                      type="button"
                      className="biz-btn biz-btn--small"
                      onClick={() => handleEdit(d)}
                      title="Editar"
                      style={{ marginBottom: '0.3rem' }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      type="button"
                      className="biz-btn biz-btn--small biz-btn--perigo"
                      onClick={() => handleDelete(d.id)}
                      title="Excluir"
                    >
                      🗑️ Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <ErrorAuthModal
        isOpen={showErrorModal}
        onClose={handleCloseErrorModal}
        message={error}
      />
    </BizShell>
  )
}
