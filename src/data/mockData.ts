import { Item } from '../types/api'
import image1 from '../assets/image1.jfif'
import image2 from '../assets/image2.jfif'
import image3 from '../assets/image3.jfif'
import image4 from '../assets/image4.jfif'
import image5 from '../assets/image5.jfif'
import image6 from '../assets/image6.jfif'

export const mockProducts: Item[] = [
  {
    id: 1,
    name: 'Vestido Florido Verão',
    price: '119.99',
    quantity: 8,
    size: 'M',
    color: 'Rosa',
    description:
      'Vestido leve em viscose florida, ótimo para o calor. Tem alça regulável e elástico na cintura. Veste do P ao G.',
    category: 'Vestidos',
    brand: 'Dora',
    imageUrl: image1,
    createdAt: '2026-04-12T10:00:00Z',
  },
  {
    id: 2,
    name: 'Blusinha Básica',
    price: '29.99',
    quantity: 14,
    size: 'P',
    color: 'Branco',
    description:
      'Blusinha básica em algodão, super versátil. Combina com tudo no armário. Tem do PP ao GG.',
    category: 'Blusas',
    brand: 'Dora',
    imageUrl: image2,
    createdAt: '2026-04-08T10:00:00Z',
  },
  {
    id: 3,
    name: 'Blusinha Branca Manga Longa',
    price: '29.99',
    quantity: 12,
    size: 'M',
    color: 'Branco',
    description:
      'Blusinha branca de mangas compridas, tecido leve. Ótima pra usar com saia ou jeans.',
    category: 'Blusas',
    brand: 'Dora',
    imageUrl: image3,
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 4,
    name: 'Calça Pantalona Areia',
    price: '119.99',
    quantity: 6,
    size: 'G',
    color: 'Bege',
    description:
      'Calça pantalona, cintura alta, com elástico atrás. Caimento solto e fresquinho.',
    category: 'Calças',
    brand: 'Dora',
    imageUrl: image4,
    createdAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 5,
    name: 'Tricô Bege Gola Alta',
    price: '119.99',
    quantity: 5,
    size: 'M',
    color: 'Bege',
    description:
      'Tricô de gola alta, quentinho, ideal pro friozinho. Lavar à mão!',
    category: 'Tricôs',
    brand: 'Dora',
    imageUrl: image5,
    createdAt: '2026-04-02T10:00:00Z',
  },
  {
    id: 6,
    name: 'Sobretudo Camelo',
    price: '129.99',
    quantity: 3,
    size: 'M',
    color: 'Camelo',
    description:
      'Sobretudo cor camelo com cinto. Esquenta bastante, ótimo pra inverno. Última peça do tamanho!',
    category: 'Casacos',
    brand: 'Dora',
    imageUrl: image6,
    createdAt: '2026-03-15T10:00:00Z',
  },
]

export const collections = [
  {
    id: 'promo',
    title: 'Promoção da Semana!',
    subtitle: '★ Confira ★',
    description:
      'Vestidos selecionados com até 30% de desconto. Aproveite!',
    image: image1,
    pieces: 24,
  },
  {
    id: 'inverno',
    title: 'Coleção Inverno',
    subtitle: '★ Acabou de Chegar ★',
    description:
      'Casacos, tricôs e cardigans pra esquentar você. Roupas quentinhas com preço bom.',
    image: image6,
    pieces: 8,
  },
  {
    id: 'basico',
    title: 'Básicos do Dia a Dia',
    subtitle: '★ Sempre tem ★',
    description:
      'Camisas, blusinhas e calças que toda mulher precisa ter no armário.',
    image: image3,
    pieces: 12,
  },
]

export const lookbook = [
  {
    id: 1,
    image: image2,
    look: 'Look 1 — Pra trabalhar',
    pieces: ['Camisa Branca Social', 'Calça Pantalona Areia'],
  },
  {
    id: 2,
    image: image4,
    look: 'Look 2 — Pra balada',
    pieces: ['Vestido Preto Básico', 'Blazer Social Bege'],
  },
  {
    id: 3,
    image: image5,
    look: 'Look 3 — Pra um casamento',
    pieces: ['Vestido Florido Verão', 'Sobretudo Camelo'],
  },
]

export const testimonials = [
  {
    id: 1,
    name: 'Dona Lurdes',
    role: 'Cliente desde 2018',
    quote:
      'Compro aqui faz tempo. A Dora é uma fofa, sempre acha o que serve em mim. Recomendo!',
  },
  {
    id: 2,
    name: 'Marina',
    role: 'Cliente do bairro',
    quote:
      'Preço bom e atendimento ótimo. Já trouxe minha mãe e minha irmã pra conhecer a loja.',
  },
  {
    id: 3,
    name: 'Júlia',
    role: 'Vizinha',
    quote:
      'Compro sempre pelo Whatsapp e a Dora ainda entrega na minha casa. Maravilhosa!',
  },
]

export const stats = [
  { value: '8 anos', label: 'no bairro' },
  { value: '+500', label: 'clientes felizes' },
  { value: '100%', label: 'atendimento da Dora' },
  { value: '0', label: 'mistério no preço' },
]

export const announcements = [
  '★ FRETE GRÁTIS para todo o bairro acima de R$ 150,00 ★',
  '★ Aceitamos Pix, cartão, boleto e crediário próprio ★',
  '★ Aberto de Segunda a Sábado, das 9h às 18h ★',
  '★ Promoção: leve 3 blusinhas e pague 2 ★',
  '★ Whats: (11) 91685-0647 — atendemos rapidinho ★',
]

export const filterCategories = [
  'Todos',
  'Vestidos',
  'Blazer',
  'Blusas',
  'Calças',
  'Tricôs',
  'Saias',
  'Casacos',
]

export const filterSizes = ['PP', 'P', 'M', 'G', 'GG']

export const filterColors = [
  { name: 'Branco', hex: '#FFFFFF' },
  { name: 'Bege', hex: '#D9C7A7' },
  { name: 'Rosa', hex: '#FFB6C1' },
  { name: 'Verde', hex: '#9CA889' },
  { name: 'Vinho', hex: '#6E1F2A' },
  { name: 'Camelo', hex: '#A87543' },
  { name: 'Marrom', hex: '#4A2C1A' },
  { name: 'Cinza', hex: '#999999' },
  { name: 'Preto', hex: '#1A1714' },
  { name: 'Colorido', hex: '#ff66cc' },
]

export const sortOptions = [
  { value: 'recent', label: 'Mais novos' },
  { value: 'price-asc', label: 'Mais barato' },
  { value: 'price-desc', label: 'Mais caro' },
  { value: 'name', label: 'Nome (A-Z)' },
]
