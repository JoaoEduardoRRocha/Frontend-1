import './AddItemPage.css'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { addItem } from '../../api/requests'
import { AddItemRequest } from '../../types/api'
import BizShell from '../../components/BizShell/BizShell'

export default function AddItemPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState<AddItemRequest>({
    name: '',
    price: 0,
    size: '',
    color: '',
    description: '',
    category: '',
    brand: '',
    quantity: 0
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!formData.name || !formData.description || !formData.category || !formData.brand || !formData.size || !formData.color) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }
      if (formData.price <= 0) {
        throw new Error('O preço deve ser maior que zero')
      }
      if (formData.quantity < 0) {
        throw new Error('A quantidade não pode ser negativa')
      }

      await addItem(formData)
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <BizShell isAdmin>
      <section className="biz-section">
        <h2 className="biz-h2">★ Adicionar Nova Peça ★</h2>
        <hr className="biz-hr" />
        <p className="biz-lead">
          Preenche os dados da peça que vai entrar no catálogo da loja.
        </p>

        <div className="biz-box biz-box--rosa">
          {error && <div className="biz-error">{error}</div>}

          <form className="biz-form" onSubmit={handleSubmit}>
            <div className="biz-form__group">
              <label htmlFor="name">Nome do produto</label>
              <input
                type="text"
                id="name"
                name="name"
                className="biz-input"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ex: Vestido Florido"
                required
                disabled={isLoading}
              />
            </div>

            <div className="biz-form__group">
              <label htmlFor="description">Descrição</label>
              <textarea
                id="description"
                name="description"
                className="biz-textarea"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Conta como é a peça, tecido, caimento..."
                rows={4}
                required
                disabled={isLoading}
              />
            </div>

            <div className="biz-form__row">
              <div className="biz-form__group">
                <label htmlFor="price">Preço (R$)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  className="biz-input"
                  value={formData.price || ''}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="biz-form__group">
                <label htmlFor="category">Categoria</label>
                <select
                  id="category"
                  name="category"
                  className="biz-select"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                >
                  <option value="">Selecione uma categoria</option>
                  <option value="Vestidos">Vestidos</option>
                  <option value="Blusas">Blusas</option>
                  <option value="Calças">Calças</option>
                  <option value="Saias">Saias</option>
                  <option value="Tricôs">Tricôs</option>
                  <option value="Casacos">Casacos</option>
                  <option value="Blazer">Blazer</option>
                </select>
              </div>
            </div>

            <div className="biz-form__row">
              <div className="biz-form__group">
                <label htmlFor="brand">Marca</label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  className="biz-input"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="Ex: Dora"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="biz-form__group">
                <label htmlFor="size">Tamanho</label>
                <input
                  type="text"
                  id="size"
                  name="size"
                  className="biz-input"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="Ex: M, P, G, GG"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="biz-form__row">
              <div className="biz-form__group">
                <label htmlFor="color">Cor</label>
                <input
                  type="text"
                  id="color"
                  name="color"
                  className="biz-input"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Ex: Rosa, Bege, Vinho"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="biz-form__group">
                <label htmlFor="quantity">Estoque</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  className="biz-input"
                  value={formData.quantity || ''}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="biz-form__actions">
              <Link to="/" className="biz-btn">← Cancelar</Link>
              <button type="submit" className="biz-btn biz-btn--rosa" disabled={isLoading}>
                {isLoading ? 'Adicionando...' : '✿ Adicionar peça'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </BizShell>
  )
}
