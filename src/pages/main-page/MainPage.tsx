import './MainPage.css'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  mockProducts,
  collections,
  testimonials,
  filterCategories,
  filterSizes,
  filterColors,
  sortOptions,
} from '../../data/mockData'
import { Item } from '../../types/api'
import BizShell from '../../components/BizShell/BizShell'

const WHATSAPP_NUMBER = '5511916850647'

const formatPrice = (v: string | number) => {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const colorHex = (name: string) => {
  const found = filterColors.find((c) => c.name.toLowerCase() === name.toLowerCase())
  return found?.hex ?? '#cfc3b1'
}

const VISIT_KEY = 'dora_visitas'

export default function MainPage() {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('recent')

  const [visitas, setVisitas] = useState<number>(2147)

  // contador de visitas (localStorage, com base "fofa")
  useEffect(() => {
    try {
      const cur = parseInt(localStorage.getItem(VISIT_KEY) || '2147', 10)
      const next = isNaN(cur) ? 2148 : cur + 1
      localStorage.setItem(VISIT_KEY, String(next))
      setVisitas(next)
    } catch {
      setVisitas(2148)
    }
  }, [])

  const filtered = useMemo<Item[]>(() => {
    let list = [...mockProducts]
    if (activeCategory !== 'Todos') list = list.filter((p) => p.category === activeCategory)
    if (selectedSizes.length > 0) list = list.filter((p) => selectedSizes.includes(p.size))
    if (selectedColors.length > 0) list = list.filter((p) => selectedColors.includes(p.color))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }

    switch (sort) {
      case 'price-asc':
        list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price))
        break
      case 'price-desc':
        list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price))
        break
      case 'name':
        list.sort((a, b) => a.name.localeCompare(b.name))
        break
      default:
        list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    }
    return list
  }, [activeCategory, selectedSizes, selectedColors, search, sort])

  const toggleSize = (s: string) =>
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    )
  const toggleColor = (c: string) =>
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    )
  const resetFilters = () => {
    setActiveCategory('Todos')
    setSelectedSizes([])
    setSelectedColors([])
    setSearch('')
    setSort('recent')
  }

  const handleWhatsApp = (item?: Item) => {
    const itemUrl = item ? `${window.location.origin}/item/${item.id}` : ''
    const message = encodeURIComponent(
      item
        ? `Olá Dora! Tenho interesse na peça "${item.name}". ${itemUrl}`
        : 'Olá Dora! Vi seu site e gostaria de saber mais.',
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  return (
    <BizShell showStoreNav>
      {/* Boas-vindas */}
      <section className="biz-bemvinda">
        <div className="biz-box biz-box--rosa">
          <h2 className="biz-box__title blink">★ Bem-vinda à nossa lojinha! ★</h2>
          <p>
            Oi, querida! Eu sou a <b>Dora</b> e essa aqui é a minha lojinha de roupas.
            Tô há 8 anos atendendo as mulheres do bairro e agora também pela <b>internet</b>!
            Dá uma olhadinha nas peças, escolhe o que gostar e me chama no <b>Whatsapp</b>.
            Eu mesma respondo!
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            <button className="biz-btn biz-btn--zap" onClick={() => handleWhatsApp()}>
              💬 Chamar a Dora no Whats
            </button>
          </p>
        </div>
      </section>

      {/* Promoções da semana */}
      <section id="promocoes" className="biz-section">
        <h2 className="biz-h2">★ Promoções da Semana ★</h2>
        <hr className="biz-hr" />
        <div className="biz-promos">
          {collections.map((c) => (
            <article key={c.id} className="biz-promo">
              <div className="biz-promo__img">
                <img src={c.image} alt={c.title} />
              </div>
              <h3 className="biz-promo__title">{c.title}</h3>
              <p className="biz-promo__sub">{c.subtitle}</p>
              <p className="biz-promo__desc">{c.description}</p>
              <a href="#produtos" className="biz-link">» Ver na loja</a>
            </article>
          ))}
        </div>
      </section>

      {/* Catálogo */}
      <section id="produtos" className="biz-section">
        <h2 className="biz-h2">✿ Nossa Loja — {filtered.length} {filtered.length === 1 ? 'peça' : 'peças'} ✿</h2>
        <hr className="biz-hr" />

        {/* Busca + ordenar */}
        <div className="biz-toolbar">
          <label>
            <b>Buscar:</b>{' '}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ex: vestido"
              className="biz-input"
            />
          </label>
          <label>
            <b>Ordenar por:</b>{' '}
            <select value={sort} onChange={(e) => setSort(e.target.value)} className="biz-select">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </label>
          <button className="biz-btn biz-btn--limpar" onClick={resetFilters}>
            Limpar filtros
          </button>
        </div>

        {/* Filtros estilo "tabela do site antigo" */}
        <table className="biz-filters">
          <tbody>
            <tr>
              <td className="biz-filters__label">Categoria:</td>
              <td>
                {filterCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`biz-tag ${activeCategory === cat ? 'is-on' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </td>
            </tr>
            <tr>
              <td className="biz-filters__label">Tamanho:</td>
              <td>
                {filterSizes.map((s) => (
                  <button
                    key={s}
                    className={`biz-tag biz-tag--sq ${selectedSizes.includes(s) ? 'is-on' : ''}`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </td>
            </tr>
            <tr>
              <td className="biz-filters__label">Cor:</td>
              <td>
                {filterColors.map((c) => (
                  <button
                    key={c.name}
                    className={`biz-tag ${selectedColors.includes(c.name) ? 'is-on' : ''}`}
                    onClick={() => toggleColor(c.name)}
                    title={c.name}
                  >
                    <span
                      className="biz-color-dot"
                      style={{ background: c.hex }}
                    />
                    {c.name}
                  </button>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Grade de produtos */}
        <div className="biz-products">
          {filtered.length === 0 && (
            <div className="biz-empty">
              <p>:( <b>Não achei nenhuma peça com esses filtros.</b></p>
              <p>Tenta limpar os filtros e olhar de novo!</p>
              <button className="biz-btn" onClick={resetFilters}>Limpar filtros</button>
            </div>
          )}

          {filtered.map((item) => (
            <article
              key={item.id}
              className="biz-card"
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <div className="biz-card__img">
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
                {item.quantity <= 4 && (
                  <span className="biz-card__badge">Só {item.quantity}!</span>
                )}
              </div>
              <h3 className="biz-card__name">{item.name}</h3>
              <p className="biz-card__meta">
                Tam <b>{item.size}</b> ·{' '}
                <span className="biz-card__cor">
                  <span className="biz-color-dot" style={{ background: colorHex(item.color) }} />
                  {item.color}
                </span>
              </p>
              <p className="biz-card__price">
                <small>R$</small> {formatPrice(item.price)}
              </p>
              <button
                className="biz-btn biz-btn--zap biz-btn--small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleWhatsApp(item)
                }}
              >
                💬 Quero essa!
              </button>
            </article>
          ))}
        </div>
      </section>

      {/* Sobre a Dora + recados */}
      <section id="sobre" className="biz-section biz-section--cols">
        <div className="biz-box biz-box--amarelo">
          <h2 className="biz-h2 biz-h2--small">Quem é a Dora?</h2>
          <hr className="biz-hr" />
          <p>
            Meu nome é <b>Dora Modas</b> e eu abri minha lojinha em 2018, depois de
            muitos anos costurando em casa pra família e amigas. Hoje atendo no
            balcão da loja, pelo Whatsapp e agora pela <i>internet</i> 😊.
          </p>
          <p style={{ marginTop: '0.8rem' }}>
            Aqui você encontra peça por preço justo, com troca garantida em 7 dias e
            <b> aquele atendimento de quem te conhece pelo nome</b>.
          </p>
        </div>

        <div className="biz-box biz-box--azul">
          <h2 className="biz-h2 biz-h2--small">★ O que dizem ★</h2>
          <hr className="biz-hr" />
          <ul className="biz-quotes">
            {testimonials.map((t) => (
              <li key={t.id}>
                <p>"{t.quote}"</p>
                <small>— {t.name}, <i>{t.role}</i></small>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="biz-section">
        <h2 className="biz-h2">✉ Como chegar / Fale conosco ✉</h2>
        <hr className="biz-hr" />
        <table className="biz-contact" cellPadding={6}>
          <tbody>
            <tr>
              <th>Endereço:</th>
              <td>Rua Salgueiro do Campo, 505 — São Paulo/SP — CEP 05814-210</td>
            </tr>
            <tr>
              <th>Telefone:</th>
              <td>(11) 3456-7890</td>
            </tr>
            <tr>
              <th>WhatsApp:</th>
              <td>
                (11) 91685-0647 ·{' '}
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Chamar agora »
                </a>
              </td>
            </tr>
            <tr>
              <th>E-mail:</th>
              <td>
                <a href="mailto:dora@doraemodas.com.br">dora@doraemodas.com.br</a>
              </td>
            </tr>
            <tr>
              <th>Horário:</th>
              <td>
                Seg a Sex das 9h às 18h · Sábado das 9h às 13h ·{' '}
                <i>Domingo fechado</i>
              </td>
            </tr>
            <tr>
              <th>Pagamento:</th>
              <td>
                ✓ Pix &nbsp; ✓ Cartão de débito &nbsp; ✓ Cartão de crédito
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      {/* Contador de visitas (estilo home antiga) */}
      <section className="biz-section" style={{ textAlign: 'center', padding: '1rem' }}>
        <p className="biz-footer__line">
          Última atualização: <b>03/05/2026</b> · Você é a visita nº{' '}
          <span className="biz-counter">{String(visitas).padStart(6, '0')}</span>
        </p>
      </section>
    </BizShell>
  )
}
