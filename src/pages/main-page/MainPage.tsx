import './MainPage.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  mockProducts,
  collections,
  lookbook,
  testimonials,
  stats,
  announcements,
  filterCategories,
  filterSizes,
  filterColors,
  sortOptions,
} from '../../data/mockData'
import { Item } from '../../types/api'

const WHATSAPP_NUMBER = '5511916850647'

const formatPrice = (v: string | number) => {
  const n = typeof v === 'string' ? parseFloat(v) : v
  return n.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

const colorHex = (name: string) => {
  const found = filterColors.find((c) => c.name.toLowerCase() === name.toLowerCase())
  return found?.hex ?? '#cfc3b1'
}

export default function MainPage() {
  const navigate = useNavigate()

  const [activeCategory, setActiveCategory] = useState<string>('Todos')
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [priceMax, setPriceMax] = useState<number>(160)
  const [search, setSearch] = useState<string>('')
  const [sort, setSort] = useState<string>('recent')
  const [filtersOpen, setFiltersOpen] = useState<boolean>(true)

  const gridRef = useRef<HTMLDivElement>(null)

  const maxPriceCap = useMemo(
    () => Math.max(...mockProducts.map((p) => parseFloat(p.price))),
    [],
  )

  const filtered = useMemo<Item[]>(() => {
    let list = [...mockProducts]
    if (activeCategory !== 'Todos') list = list.filter((p) => p.category === activeCategory)
    if (selectedSizes.length > 0) list = list.filter((p) => selectedSizes.includes(p.size))
    if (selectedColors.length > 0)
      list = list.filter((p) => selectedColors.includes(p.color))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q),
      )
    }
    list = list.filter((p) => parseFloat(p.price) <= priceMax)

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
  }, [activeCategory, selectedSizes, selectedColors, priceMax, search, sort])

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
    setPriceMax(Math.ceil(maxPriceCap))
    setSearch('')
    setSort('recent')
  }

  // Reveal-on-scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-revealed')
            io.unobserve(e.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    document.querySelectorAll('[data-reveal]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [filtered])

  const handleWhatsApp = (item: Item) => {
    const itemUrl = `${window.location.origin}/item/${item.id}`
    const message = encodeURIComponent(
      `Olá Dora, tenho interesse na peça "${item.name}".\n\n${itemUrl}`,
    )
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank')
  }

  return (
    <div className="dora">
      {/* TICKER */}
      <div className="dora-ticker" aria-hidden="true">
        <div className="dora-ticker__track">
          {[...announcements, ...announcements].map((a, i) => (
            <span key={i} className="dora-ticker__item">
              <span className="dora-ticker__dot">✦</span>
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* NAV */}
      <header className="dora-nav">
        <div className="dora-nav__inner">
          <div className="dora-nav__left">
            <a href="#colecoes" className="dora-nav__link">Coleções</a>
            <a href="#curadoria" className="dora-nav__link">Curadoria</a>
            <a href="#lookbook" className="dora-nav__link">Lookbook</a>
            <a href="#atelier" className="dora-nav__link">Atelier</a>
          </div>
          <a href="#" className="dora-nav__brand">
            Dora
            <span className="dora-nav__brand-amp">&amp;</span>
            Modas
          </a>
          <div className="dora-nav__right">
            <button className="dora-nav__icon" aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </button>
            <button className="dora-nav__icon" aria-label="Conta" onClick={() => navigate('/login')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c1.5-4.5 5-6 8-6s6.5 1.5 8 6" strokeLinecap="round" />
              </svg>
            </button>
            <button className="dora-nav__bag" aria-label="Sacola">
              Sacola <span className="dora-nav__bag-count">02</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="dora-hero">
        <div className="dora-hero__grid">
          <div className="dora-hero__copy" data-reveal>
            <span className="dora-eyebrow">
              <span className="dora-eyebrow__bar" /> Coleção 04 / 2026
            </span>
            <h1 className="dora-hero__title">
              Peças que
              <br />
              <em>respiram</em> com
              <br />
              quem as veste.
            </h1>
            <p className="dora-hero__lede">
              Costuradas devagar. Tecidos vivos, modelagem precisa,
              cuidado vitalício. Um atelier brasileiro construindo um guarda-roupa
              que dura décadas — não temporadas.
            </p>
            <div className="dora-hero__cta">
              <a href="#grade" className="dora-btn dora-btn--filled">
                Explorar a coleção
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#atelier" className="dora-btn dora-btn--ghost">
                Conhecer o atelier
              </a>
            </div>

            <dl className="dora-hero__meta">
              <div>
                <dt>Atelier</dt>
                <dd>São Paulo, BR</dd>
              </div>
              <div>
                <dt>Lançamento</dt>
                <dd>Maio · 2026</dd>
              </div>
              <div>
                <dt>Edição</dt>
                <dd>Limitada · 187 peças</dd>
              </div>
            </dl>
          </div>

          <div className="dora-hero__visual" data-reveal>
            <div className="dora-hero__photo dora-hero__photo--main">
              <img
                src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=900&q=80"
                alt="Modelo vestindo peça da coleção"
              />
              <span className="dora-hero__tag">Look 03 — Ocre & Linho</span>
            </div>
            <div className="dora-hero__photo dora-hero__photo--inset">
              <img
                src="https://images.unsplash.com/photo-1485518882345-15568b007407?w=600&q=80"
                alt="Detalhe têxtil"
              />
            </div>
            <div className="dora-hero__chip">
              <span className="dora-hero__chip-num">04</span>
              <span className="dora-hero__chip-text">
                Coleções
                <br />
                por ano
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* PROMISES */}
      <section className="dora-promises">
        <div className="dora-promises__row">
          {[
            { k: 'I', t: 'Costura à mão', s: 'Cada peça finalizada por uma artesã' },
            { k: 'II', t: 'Tecidos naturais', s: 'Linho, seda, alpaca, algodão pima' },
            { k: 'III', t: 'Ajustes vitalícios', s: 'Reparos e modificações para sempre' },
            { k: 'IV', t: 'Edição limitada', s: 'Sem reposições; sem desperdício' },
          ].map((p) => (
            <div key={p.k} className="dora-promises__cell" data-reveal>
              <span className="dora-promises__num">{p.k}</span>
              <span className="dora-promises__title">{p.t}</span>
              <span className="dora-promises__sub">{p.s}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CURADORIA / COLLECTIONS */}
      <section id="curadoria" className="dora-curadoria">
        <div className="dora-section-head">
          <span className="dora-section-head__label">§ 01 — Curadoria</span>
          <h2 className="dora-section-head__title">
            Três coleções <em>vivas</em>,
            <br />
            costuradas neste momento.
          </h2>
        </div>

        <div className="dora-curadoria__grid">
          {collections.map((c, idx) => (
            <article
              key={c.id}
              className={`dora-collection dora-collection--${idx}`}
              data-reveal
            >
              <div className="dora-collection__image">
                <img src={c.image} alt={c.title} />
                <span className="dora-collection__pieces">{c.pieces} peças</span>
              </div>
              <div className="dora-collection__body">
                <span className="dora-collection__sub">{c.subtitle}</span>
                <h3 className="dora-collection__title">{c.title}</h3>
                <p className="dora-collection__desc">{c.description}</p>
                <a href="#grade" className="dora-link">
                  Ver peças <span aria-hidden>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* GRID + FILTERS */}
      <section id="grade" className="dora-grade">
        <div className="dora-section-head dora-section-head--with-controls">
          <div>
            <span className="dora-section-head__label">§ 02 — Vitrine</span>
            <h2 className="dora-section-head__title">
              {filtered.length}
              <span className="dora-section-head__title-sub">
                {' '}
                {filtered.length === 1 ? 'peça' : 'peças'} disponíveis
              </span>
            </h2>
          </div>

          <div className="dora-controls">
            <div className="dora-search">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
              <input
                type="text"
                placeholder="Buscar por peça, marca ou categoria"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button onClick={() => setSearch('')} className="dora-search__clear" aria-label="Limpar">
                  ×
                </button>
              )}
            </div>

            <div className="dora-sort">
              <label>Ordenar</label>
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="dora-filter-toggle"
              onClick={() => setFiltersOpen((s) => !s)}
              aria-expanded={filtersOpen}
            >
              Filtros
              <span className={`dora-filter-toggle__chev ${filtersOpen ? 'is-open' : ''}`}>↓</span>
            </button>
          </div>
        </div>

        {filtersOpen && (
          <div className="dora-filters" data-reveal>
            {/* Categories */}
            <div className="dora-filter">
              <span className="dora-filter__label">Categoria</span>
              <div className="dora-chips">
                {filterCategories.map((cat) => (
                  <button
                    key={cat}
                    className={`dora-chip ${activeCategory === cat ? 'is-active' : ''}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            <div className="dora-filter">
              <span className="dora-filter__label">Tamanho</span>
              <div className="dora-chips">
                {filterSizes.map((s) => (
                  <button
                    key={s}
                    className={`dora-chip dora-chip--square ${
                      selectedSizes.includes(s) ? 'is-active' : ''
                    }`}
                    onClick={() => toggleSize(s)}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="dora-filter">
              <span className="dora-filter__label">Cor</span>
              <div className="dora-color-row">
                {filterColors.map((c) => (
                  <button
                    key={c.name}
                    className={`dora-color ${selectedColors.includes(c.name) ? 'is-active' : ''}`}
                    onClick={() => toggleColor(c.name)}
                    title={c.name}
                  >
                    <span className="dora-color__swatch" style={{ background: c.hex }} />
                    <span className="dora-color__name">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Price slider */}
            <div className="dora-filter dora-filter--range">
              <div className="dora-filter__row">
                <span className="dora-filter__label">Preço até</span>
                <span className="dora-filter__value">R$ {formatPrice(priceMax)}</span>
              </div>
              <input
                type="range"
                min={80}
                max={Math.ceil(maxPriceCap)}
                step={1}
                value={priceMax}
                onChange={(e) => setPriceMax(parseInt(e.target.value))}
                className="dora-range"
              />
              <div className="dora-range__rail">
                <span>R$ 80</span>
                <span>R$ {formatPrice(Math.ceil(maxPriceCap))}</span>
              </div>
            </div>

            <div className="dora-filters__actions">
              <button className="dora-link dora-link--inline" onClick={resetFilters}>
                Limpar tudo
              </button>
            </div>
          </div>
        )}

        {/* Active filter pills */}
        {(activeCategory !== 'Todos' || selectedSizes.length > 0 || selectedColors.length > 0) && (
          <div className="dora-active-filters">
            {activeCategory !== 'Todos' && (
              <span className="dora-pill">
                {activeCategory}
                <button onClick={() => setActiveCategory('Todos')}>×</button>
              </span>
            )}
            {selectedSizes.map((s) => (
              <span key={s} className="dora-pill">
                Tam · {s}
                <button onClick={() => toggleSize(s)}>×</button>
              </span>
            ))}
            {selectedColors.map((c) => (
              <span key={c} className="dora-pill">
                <span className="dora-pill__dot" style={{ background: colorHex(c) }} />
                {c}
                <button onClick={() => toggleColor(c)}>×</button>
              </span>
            ))}
          </div>
        )}

        {/* Editorial product grid */}
        <div className="dora-products" ref={gridRef}>
          {filtered.length === 0 && (
            <div className="dora-empty">
              <h3>Nenhuma peça neste recorte.</h3>
              <p>Tente ampliar os filtros ou olhar outra coleção.</p>
              <button className="dora-btn dora-btn--ghost" onClick={resetFilters}>
                Limpar filtros
              </button>
            </div>
          )}
          {filtered.map((item, idx) => (
            <article
              key={item.id}
              className={`dora-card ${idx % 7 === 0 ? 'dora-card--feature' : ''}`}
              data-reveal
              onClick={() => navigate(`/item/${item.id}`)}
            >
              <div className="dora-card__image">
                <img src={item.imageUrl} alt={item.name} loading="lazy" />
                <button
                  className="dora-card__quick"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleWhatsApp(item)
                  }}
                >
                  Conversar sobre essa peça
                </button>
                {item.quantity <= 4 && (
                  <span className="dora-card__badge">Últimas {item.quantity}</span>
                )}
              </div>
              <div className="dora-card__body">
                <div className="dora-card__brand">
                  <span>{item.brand}</span>
                  <span className="dora-card__cat">{item.category}</span>
                </div>
                <h3 className="dora-card__name">{item.name}</h3>
                <div className="dora-card__foot">
                  <span className="dora-card__price">R$ {formatPrice(item.price)}</span>
                  <span className="dora-card__color">
                    <span className="dora-card__dot" style={{ background: colorHex(item.color) }} />
                    {item.color} · {item.size}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* LOOKBOOK */}
      <section id="lookbook" className="dora-lookbook">
        <div className="dora-lookbook__head" data-reveal>
          <span className="dora-section-head__label">§ 03 — Lookbook</span>
          <h2 className="dora-section-head__title">
            Três <em>looks</em>, três
            <br />
            maneiras de habitar
            <br />
            esta estação.
          </h2>
        </div>

        <div className="dora-lookbook__grid">
          {lookbook.map((l, i) => (
            <figure
              key={l.id}
              className={`dora-look dora-look--${i}`}
              data-reveal
            >
              <div className="dora-look__frame">
                <img src={l.image} alt={l.look} loading="lazy" />
              </div>
              <figcaption>
                <span className="dora-look__num">0{l.id}</span>
                <h4>{l.look}</h4>
                <ul>
                  {l.pieces.map((p) => (
                    <li key={p}>— {p}</li>
                  ))}
                </ul>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section id="atelier" className="dora-stats">
        <div className="dora-stats__inner">
          <div className="dora-stats__copy" data-reveal>
            <span className="dora-section-head__label dora-section-head__label--light">
              § 04 — O Atelier
            </span>
            <h2 className="dora-stats__title">
              Em <em>números</em>,
              <br />
              uma costura
              <br />
              do tempo.
            </h2>
            <p className="dora-stats__lede">
              Trabalhamos com 14 cooperativas e ateliês independentes em
              Minas, Cusco, e na Sé paulistana. Toda peça vem com etiqueta
              gravada à mão e a assinatura da artesã que a finalizou.
            </p>
          </div>

          <div className="dora-stats__grid" data-reveal>
            {stats.map((s, i) => (
              <div key={i} className="dora-stat">
                <span className="dora-stat__value">{s.value}</span>
                <span className="dora-stat__label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="dora-quotes">
        <div className="dora-quotes__head" data-reveal>
          <span className="dora-section-head__label">§ 05 — Em palavras</span>
        </div>
        <div className="dora-quotes__grid">
          {testimonials.map((t) => (
            <blockquote key={t.id} className="dora-quote" data-reveal>
              <span className="dora-quote__mark">&ldquo;</span>
              <p>{t.quote}</p>
              <footer>
                <strong>{t.name}</strong>
                <span>{t.role}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="dora-news">
        <div className="dora-news__inner" data-reveal>
          <div className="dora-news__copy">
            <span className="dora-section-head__label dora-section-head__label--light">
              § 06 — Diário
            </span>
            <h2 className="dora-news__title">
              Receba o <em>diário</em> do
              <br />
              atelier no e-mail.
            </h2>
            <p>
              Uma carta mensal sobre tecidos, colaborações e o que está
              sendo costurado agora. Sem promoções, sem ruído.
            </p>
          </div>
          <form
            className="dora-news__form"
            onSubmit={(e) => {
              e.preventDefault()
              const input = (e.target as HTMLFormElement).elements.namedItem('email') as HTMLInputElement
              alert(`Obrigada — adicionamos ${input.value} ao diário.`)
              input.value = ''
            }}
          >
            <input type="email" name="email" required placeholder="seu@endereço" />
            <button type="submit">
              Assinar
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </form>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="dora-footer">
        <div className="dora-footer__inner">
          <div className="dora-footer__brand">
            <h3>Dora&amp;Modas</h3>
            <p>Atelier de coleção · São Paulo · est. 2018</p>
          </div>
          <div className="dora-footer__cols">
            <div>
              <h5>Coleções</h5>
              <a>Primavera Lenta</a>
              <a>Estúdio Noir</a>
              <a>Andina</a>
              <a>Arquivo</a>
            </div>
            <div>
              <h5>Atelier</h5>
              <a>Nossa história</a>
              <a>Materiais</a>
              <a>Cooperativas</a>
              <a>Sustentabilidade</a>
            </div>
            <div>
              <h5>Cuidados</h5>
              <a>Programa de ajustes</a>
              <a>Trocas e devoluções</a>
              <a>Lavagem</a>
              <a>Contato</a>
            </div>
          </div>
        </div>
        <div className="dora-footer__bottom">
          <span>© 2026 Dora&amp;Modas — Costurado em São Paulo</span>
          <span>BR · PT</span>
        </div>
      </footer>
    </div>
  )
}
