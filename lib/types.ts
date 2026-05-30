export interface AppData {
  appName: string
  subtitle: string
  developerName: string
  category: string
  rating: number
  reviewCount: number
  price: string        // "" = free, "0.99" = paid
  buttonType: 'GET' | 'price' | 'INSTALL'
  hasInAppPurchases: boolean
  iconDataUrl: string  // base64 or ""
  screenshots: string[] // base64 array, max 8
}

export interface StoreVisibility {
  googlePlay: boolean
  appStore: boolean
}

export type PreviewMode = 'detail' | 'search'

export const DEFAULT_APP_DATA: AppData = {
  appName: 'Your App Name',
  subtitle: 'App Subtitle',
  developerName: 'Developer Name',
  category: 'Utilities',
  rating: 4.5,
  reviewCount: 12000,
  price: '',
  buttonType: 'GET',
  hasInAppPurchases: false,
  iconDataUrl: '',
  screenshots: [],
}
