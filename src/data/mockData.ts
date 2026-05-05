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
    name: 'Conjunto Veludo Marrom',
    price: '119.99',
    quantity: 8,
    size: 'M',
    color: 'Marrom',
    description:
      'Conjuntinho de jaqueta cropped + calça em veludo cotelê marrom. Cai super bem com bota e vai do trabalho pro happy hour. Veste do P ao G.',
    category: 'Conjuntos',
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
      'Blusinha básica em algodão, super versátil. Combina com tudo no armário. Disponível em branco e rosa, do PP ao GG.',
    category: 'Blusas',
    brand: 'Dora',
    imageUrl: image2,
    createdAt: '2026-04-08T10:00:00Z',
  },
  {
    id: 3,
    name: 'Body Marrom Decotado',
    price: '29.99',
    quantity: 12,
    size: 'M',
    color: 'Marrom',
    description:
      'Body cavado cor marrom, tecido firminho que modela bem. Ótimo pra usar com saia ou jeans de cintura alta.',
    category: 'Blusas',
    brand: 'Dora',
    imageUrl: image3,
    createdAt: '2026-04-15T10:00:00Z',
  },
  {
    id: 4,
    name: 'Vestido Coral Verão',
    price: '119.99',
    quantity: 6,
    size: 'G',
    color: 'Coral',
    description:
      'Vestido fluido cor coral, alcinha fininha, perfeito pra um dia quente. Tecido leve, não amassa fácil.',
    category: 'Vestidos',
    brand: 'Dora',
    imageUrl: image4,
    createdAt: '2026-03-28T10:00:00Z',
  },
  {
    id: 5,
    name: 'Vestido Camisa Verde',
    price: '119.99',
    quantity: 5,
    size: 'M',
    color: 'Verde',
    description:
      'Vestido chemise verde com botões e cintinho na cintura. Elegante e confortável, vai bem em qualquer ocasião.',
    category: 'Vestidos',
    brand: 'Dora',
    imageUrl: image5,
    createdAt: '2026-04-02T10:00:00Z',
  },
  {
    id: 6,
    name: 'Vestido Azul Botões',
    price: '129.99',
    quantity: 3,
    size: 'M',
    color: 'Azul',
    description:
      'Vestido midi azul com botões na frente. Caimento solto e tecido fresquinho. Última peça do tamanho!',
    category: 'Vestidos',
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
    image: image5,
    pieces: 24,
  },
  {
    id: 'meia-estacao',
    title: 'Coleção Meia Estação',
    subtitle: '★ Acabou de Chegar ★',
    description:
      'Conjuntinhos, vestidos e peças coringa pro friozinho da manhã e o sol da tarde.',
    image: image1,
    pieces: 8,
  },
  {
    id: 'basico',
    title: 'Básicos do Dia a Dia',
    subtitle: '★ Sempre tem ★',
    description:
      'Bodies, blusinhas e vestidos que toda mulher precisa ter no armário.',
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
    role: 'Cliente desde 1996',
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
  { value: '30 anos', label: 'no bairro' },
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
  'Conjuntos',
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
  { name: 'Coral', hex: '#FF8A70' },
  { name: 'Verde', hex: '#7FA77A' },
  { name: 'Azul', hex: '#6E91B8' },
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
