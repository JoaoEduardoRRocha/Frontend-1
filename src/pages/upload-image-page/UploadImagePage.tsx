import './UploadImagePage.css'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { getAllItems, isAuthenticated, isAdmin } from '../../api/requests'
import { Item } from '../../types/api'
import { ImageUpload } from '../../components/ImageUpload'
import Loading from '../../components/Loading/Loading'
import ErrorAuthModal from '../../components/ErrorAuthModal/ErrorAuthModal'
import BizShell from '../../components/BizShell/BizShell'

export default function UploadImagePage() {
  const [items, setItems] = useState<Item[]>([])
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [userIsAuthenticated, setUserIsAuthenticated] = useState(false)
  const [userIsAdmin, setUserIsAdmin] = useState(false)

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
          setError('Apenas administradores podem fazer upload de imagens')
          setShowErrorModal(true)
          return
        }
        const itemsData = await getAllItems()
        setItems(itemsData)
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

  const handleImageUpload = (imageUrl: string) => {
    if (selectedItem) {
      const updatedItem = { ...selectedItem, imageUrl }
      setSelectedItem(updatedItem)
      setItems(prev => prev.map(item =>
        item.id === selectedItem.id ? { ...item, imageUrl } : item
      ))
    }
  }

  if (isLoading) {
    return (
      <BizShell isAdmin={userIsAdmin}>
        <section className="biz-section">
          <div className="biz-box biz-box--rosa biz-box--narrow" style={{ textAlign: 'center' }}>
            <Loading isVisible={true} />
            <p>Carregando dados...</p>
          </div>
        </section>
      </BizShell>
    )
  }

  if (!userIsAuthenticated || !userIsAdmin) {
    return (
      <BizShell isAdmin={userIsAdmin}>
        <section className="biz-section">
          <div className="biz-box biz-box--rosa biz-box--narrow" style={{ textAlign: 'center' }}>
            <h2 className="biz-h2 biz-h2--small">Acesso negado</h2>
            <hr className="biz-hr" />
            <p>Esta página é restrita a administradores.</p>
            <p style={{ marginTop: '1rem' }}>
              <Link to="/" className="biz-btn">← Voltar pra loja</Link>
            </p>
          </div>
        </section>
        <ErrorAuthModal
          isOpen={showErrorModal}
          onClose={() => { setShowErrorModal(false); setError('') }}
          message={error || 'Erro de acesso'}
        />
      </BizShell>
    )
  }

  return (
    <BizShell isAdmin>
      <section className="biz-section">
        <h2 className="biz-h2">📷 Upload de fotos</h2>
        <hr className="biz-hr" />
        <p className="biz-lead">
          Selecione uma peça e suba a foto que vai aparecer na vitrine.
        </p>

        <div className="biz-box biz-box--azul">
          <h3 className="biz-h3">1. Escolha a peça</h3>
          <div className="biz-pick">
            {items.map(item => (
              <button
                key={item.id}
                type="button"
                className={`biz-pick__item ${selectedItem?.id === item.id ? 'is-on' : ''}`}
                onClick={() => setSelectedItem(item)}
              >
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="biz-pick__thumb" />
                ) : (
                  <div className="biz-pick__thumb" />
                )}
                <div>
                  <div className="biz-pick__name">{item.name}</div>
                  <div className="biz-pick__meta">{item.category} · {item.brand}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {selectedItem && (
          <div className="biz-box biz-box--rosa" style={{ marginTop: '1rem' }}>
            <h3 className="biz-h3">2. Upload da foto — {selectedItem.name}</h3>
            <ImageUpload
              onImageUpload={handleImageUpload}
              currentImageUrl={selectedItem.imageUrl}
              itemId={selectedItem.id}
            />
            <table className="biz-info-table" style={{ marginTop: '0.8rem' }}>
              <tbody>
                <tr><th>Categoria:</th><td>{selectedItem.category}</td></tr>
                <tr><th>Marca:</th><td>{selectedItem.brand}</td></tr>
                <tr><th>Tamanho:</th><td>{selectedItem.size}</td></tr>
                <tr><th>Cor:</th><td>{selectedItem.color}</td></tr>
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ErrorAuthModal
        isOpen={showErrorModal}
        onClose={() => { setShowErrorModal(false); setError('') }}
        message={error || 'Erro ao carregar dados'}
      />
    </BizShell>
  )
}
