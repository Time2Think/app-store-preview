export type Theme = 'light' | 'dark'

export interface IOSTokens {
  systemBlue: string
  label: string
  secondaryLabel: string
  tertiaryLabel: string
  separator: string
  hairline: string
  systemBackground: string
  groupedBackground: string
  cardSearchTint: string
  cardSurface: string
  searchFieldBg: string
  searchFieldText: string
  buttonTint: string
  starEmpty: string
  tabBarBg: string
  starFilled: string
}

export function iosTokens(theme: Theme): IOSTokens {
  if (theme === 'dark') return {
    systemBlue: '#0A84FF',
    label: '#FFFFFF',
    secondaryLabel: 'rgba(235,235,245,0.60)',
    tertiaryLabel: 'rgba(235,235,245,0.30)',
    separator: 'rgba(84,84,88,0.65)',
    hairline: 'rgba(84,84,88,0.65)',
    systemBackground: '#000000',
    groupedBackground: '#000000',
    cardSearchTint: '#1C1C1E',
    cardSurface: '#1C1C1E',
    searchFieldBg: '#1C1C1E',
    searchFieldText: '#8E8E93',
    buttonTint: 'rgba(10,132,255,0.18)',
    starEmpty: '#3A3A3C',
    tabBarBg: 'rgba(22,22,23,0.94)',
    starFilled: '#FF9500',
  }
  return {
    systemBlue: '#007AFF',
    label: '#000000',
    secondaryLabel: 'rgba(60,60,67,0.60)',
    tertiaryLabel: 'rgba(60,60,67,0.30)',
    separator: 'rgba(60,60,67,0.29)',
    hairline: 'rgba(60,60,67,0.29)',
    systemBackground: '#FFFFFF',
    groupedBackground: '#F2F2F7',
    cardSearchTint: '#EEF3FB',
    cardSurface: '#FFFFFF',
    searchFieldBg: '#EFEFF0',
    searchFieldText: '#8E8E93',
    buttonTint: 'rgba(0,122,255,0.15)',
    starEmpty: '#D1D1D6',
    tabBarBg: 'rgba(249,249,249,0.94)',
    starFilled: '#FF9500',
  }
}

export const iosType = {
  caption2: 11,
  caption1: 12,
  footnote: 13,
  subhead: 15,
  callout: 16,
  body: 17,
  headline: 17,
  title3: 20,
  title2: 22,
  title1: 28,
  largeTitle: 34,
} as const
