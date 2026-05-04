import {
  User,
  Item,
  LoginResponse,
  AddItemRequest,
  UpdateItemRequest,
} from '../types/api'
import { mockProducts } from '../data/mockData'

// Mock-only API layer. Nenhuma requisição de rede é feita.
// Mantém a mesma assinatura das funções originais para compatibilidade
// com as outras páginas do projeto.

export const API_BASE_URL = 'mock://local'

const delay = (ms = 220) => new Promise((r) => setTimeout(r, ms))

let inMemoryItems: Item[] = [...mockProducts]
let nextId = inMemoryItems.length + 1

const getAccessToken = (): string | null => localStorage.getItem('access-token')

export const signupUser = async (
  name: string,
  email: string,
  _password: string,
  _passwordConfirmation: string,
) => {
  await delay()
  return { user: { id: 'mock-user', name, email, isAdmin: false } }
}

export const getCurrentUser = async (): Promise<User> => {
  await delay()
  return {
    id: 'mock-user',
    name: 'Visitante',
    email: 'visitante@doramodas.local',
    isAdmin: false,
  }
}

export const getAllItems = async (): Promise<Item[]> => {
  await delay()
  return [...inMemoryItems]
}

export const isAuthenticated = (): boolean => getAccessToken() !== null

export const isAdmin = async (): Promise<boolean> => false

export const clearAuth = (): void => {
  localStorage.removeItem('access-token')
}

export const loginUser = async (
  _email: string,
  _password: string,
): Promise<LoginResponse> => {
  await delay()
  const token = 'mock-token'
  localStorage.setItem('access-token', token)
  return { accessToken: token }
}

export const getItem = async (itemId: number): Promise<Item> => {
  await delay()
  const found = inMemoryItems.find((i) => i.id === itemId)
  if (!found) throw new Error('Item não encontrado')
  return found
}

export const addItem = async (itemData: AddItemRequest): Promise<Item> => {
  await delay()
  const created: Item = {
    id: nextId++,
    name: itemData.name,
    price: String(itemData.price),
    quantity: itemData.quantity,
    size: itemData.size,
    color: itemData.color,
    description: itemData.description,
    category: itemData.category,
    brand: itemData.brand,
    imageUrl: itemData.imageUrl,
    createdAt: new Date().toISOString(),
  }
  inMemoryItems = [created, ...inMemoryItems]
  return created
}

export const deleteItem = async (itemId: number): Promise<string> => {
  await delay()
  inMemoryItems = inMemoryItems.filter((i) => i.id !== itemId)
  return 'Item removido (mock)'
}

export const updateItem = async (
  itemId: number,
  itemData: UpdateItemRequest,
): Promise<Item> => {
  await delay()
  const idx = inMemoryItems.findIndex((i) => i.id === itemId)
  if (idx === -1) throw new Error('Item não encontrado')
  const updated: Item = {
    ...inMemoryItems[idx],
    ...itemData,
    price: String(itemData.price),
  }
  inMemoryItems[idx] = updated
  return updated
}
