import './ItemDetailPage.css'
import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getItem, isAuthenticated, isAdmin, deleteItem, updateItem } from '../../api/requests'
import { Item, UpdateItemRequest } from '../../types/api'
import Loading from '../../components/Loading/Loading'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import DeleteConfirmationModal from '../../components/DeleteConfirmationModal/DeleteConfirmationModal'
import EditItemModal from '../../components/EditItemModal/EditItemModal'
import { ImageModal } from '../../components/ImageModal'
import BizShell from '../../components/BizShell/BizShell'
import { filterColors } from '../../data/mockData'

const WHATSAPP_NUMBER = '5511916850647'

const colorHex = (name: string) => {
  const found = filterColors.find((c) => c.name.toLowerCase() === name.toLowerCase())
  return found?.hex ?? '#cfc3b1'
}

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [item, setItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showImageModal, setShowImageModal] = useState(false)
  const [editFormData, setEditFormData] = useState<UpdateItemRequest>({
    name: '', price: 0, quantity: 0, size: '', color: '',
    description: '', category: '', brand: '', imageUrl: ''
  })

  useEffect(() => {
    const loadItem = async () => {
      if (!id) {
        setError('ID do item não fornecido')
        setShowErrorModal(true)
        setIsLoading(false)
        return
      }
      try {
        setIsLoading(true)
        const itemData = await getItem(parseInt(id))
        setItem(itemData)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar item'
        setError(errorMessage)
        setShowErrorModal(true)
      } finally {
        setIsLoading(false)
      }
    }

    const checkAuthStatus = async () => {
      if (isAuthenticated()) {
        try {
          setUserIsAdmin(await isAdmin())
        } catch {
          setUserIsAdmin(false)
        }
      } else {
        setUserIsAdmin(false)
      }
    }

    loadItem()
    checkAuthStatus()
  }, [id])

  const handleDeleteConfirm = async () => {
    if (!item) return
    setIsDeleting(true)
    setShowDeleteConfirm(false)
    try {
      await deleteItem(item.id)
      navigate('/', { replace: true })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar item'
      setError(errorMessage)
      setShowErrorModal(true)
    } finally {
      setIsDeleting(false)
    }
  }

  const handleEditClick = () => {
    if (item) {
      setEditFormData({
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        description: item.description,
        category: item.category,
        brand: item.brand,
        imageUrl: item.imageUrl || ''
      })
      setShowEditModal(true)
    }
  }

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setEditFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }))
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!item) return
    setIsEditing(true)
    try {
      if (!editFormData.name || !editFormData.description || !editFormData.category || !editFormData.brand || !editFormData.size || !editFormData.color) {
        throw new Error('Por favor, preencha todos os campos obrigatórios')
      }
      if (editFormData.price <= 0) throw new Error('O preço deve ser maior que zero')
      if (editFormData.quantity < 0) throw new Error('A quantidade não pode ser negativa')

      const updatedItem = await updateItem(item.id, editFormData)
      setItem(updatedItem)
      setShowEditModal(false)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar item'
      setError(errorMessage)
      setShowErrorModal(true)
    } finally {
      setIsEditing(false)
    }
  }

  const handleWhatsApp = () => {
    if (!item) return
    const itemUrl = `${window.location.origin}/item/${item.id}`
    const message = encodeURIComponent(`Olá Dora! Tenho interesse na peça "${item.name}". ${itemUrl}`)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  if (isLoading) {
    return (
      <BizShell isAdmin={userIsAdmin}>
        <section className="biz-section" style={{ textAlign: 'center' }}>
          <Loading isVisible={true} />
          <p>Carregando detalhes...</p>
        </section>
      </BizShell>
    )
  }

  if (!item) {
    return (
      <BizShell isAdmin={userIsAdmin}>
        <section className="biz-section">
          <div className="biz-box biz-box--rosa biz-box--narrow" style={{ textAlign: 'center' }}>
            <h2 className="biz-h2 biz-h2--small">Peça não encontrada</h2>
            <hr className="biz-hr" />
            <p>Essa peça não existe mais ou foi removida da loja.</p>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/" className="biz-btn">← Voltar pra loja</Link>
            </p>
          </div>
        </section>
        <ErrorAuthModal
          isOpen={showErrorModal}
          onClose={() => { setShowErrorModal(false); setError('') }}
          message={error || 'Erro ao carregar item'}
        />
      </BizShell>
    )
  }

  return (
    <BizShell isAdmin={userIsAdmin}>
      <section className="biz-section">
        <h2 className="biz-h2">✿ {item.name} ✿</h2>
        <hr className="biz-hr" />

        <div className="biz-detail">
          <div className="biz-detail__img">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.name}
                onClick={() => setShowImageModal(true)}
                title="Clique para ampliar"
              />
            ) : (
              <div style={{ height: '32rem', background: 'var(--cinza-claro)' }} />
            )}
          </div>

          <div>
            {userIsAdmin && (
              <p className="biz-detail__id">ID: {item.id}</p>
            )}
            <p className="biz-detail__price">
              R$ {parseFloat(item.price).toFixed(2)}
            </p>

            <table className="biz-info-table">
              <tbody>
                <tr><th>Categoria:</th><td>{item.category}</td></tr>
                <tr><th>Marca:</th><td>{item.brand}</td></tr>
                <tr><th>Tamanho:</th><td><b>{item.size}</b></td></tr>
                <tr>
                  <th>Cor:</th>
                  <td>
                    <span className="biz-card__cor">
                      <span
                        className="biz-color-dot"
                        style={{ background: colorHex(item.color) }}
                      />
                      {item.color}
                    </span>
                  </td>
                </tr>
                <tr><th>Estoque:</th><td>{item.quantity} unidades</td></tr>
                {userIsAdmin && (
                  <tr>
                    <th>Cadastro:</th>
                    <td>
                      {new Date(item.createdAt).toLocaleDateString('pt-BR', {
                        year: 'numeric', month: 'long', day: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <p style={{ marginTop: '1rem' }}>
              <button
                type="button"
                className="biz-btn biz-btn--zap biz-btn--block"
                onClick={handleWhatsApp}
              >
                💬 Quero essa peça! Chamar a Dora
              </button>
            </p>
          </div>
        </div>
      </section>

      <section className="biz-section">
        <h2 className="biz-h2 biz-h2--small">Descrição completa</h2>
        <hr className="biz-hr" />
        <div className="biz-box biz-box--azul">
          <p>{item.description}</p>
        </div>
      </section>

      {userIsAdmin && (
        <section className="biz-section">
          <h2 className="biz-h2 biz-h2--small">★ Painel da Dora (admin) ★</h2>
          <hr className="biz-hr" />
          <div className="biz-form__actions" style={{ justifyContent: 'center' }}>
            <button
              type="button"
              className="biz-btn biz-btn--rosa"
              onClick={handleEditClick}
              disabled={isDeleting || isEditing}
            >
              ✏️ Editar peça
            </button>
            <Link to="/upload-image" className="biz-btn">📷 Trocar foto</Link>
            <button
              type="button"
              className="biz-btn biz-btn--perigo"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isDeleting || isEditing}
            >
              {isDeleting ? 'Deletando...' : '🗑️ Deletar peça'}
            </button>
          </div>
        </section>
      )}

      <ErrorAuthModal
        isOpen={showErrorModal}
        onClose={() => { setShowErrorModal(false); setError('') }}
        message={error || 'Erro ao carregar dados'}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteConfirm}
        itemName={item.name}
        isDeleting={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteConfirm(false)}
      />

      <EditItemModal
        isOpen={showEditModal}
        isEditing={isEditing}
        formData={editFormData}
        onSubmit={handleEditSubmit}
        onChange={handleEditChange}
        onCancel={() => setShowEditModal(false)}
        onImageUpload={(imageUrl) => setEditFormData(prev => ({ ...prev, imageUrl }))}
        itemId={item.id}
      />

      <ImageModal
        isOpen={showImageModal}
        imageUrl={item.imageUrl || ''}
        imageAlt={item.name}
        onClose={() => setShowImageModal(false)}
      />
    </BizShell>
  )
}
