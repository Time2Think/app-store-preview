export type Theme = 'light' | 'dark'

export interface AndroidTokens {
  primary: string
  onPrimary: string
  surface: string
  surfaceContainer: string
  surfaceContainerHigh: string
  onSurface: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  primaryContainer: string
  onPrimaryContainer: string
  starFilled: string
  navBg: string
  searchBg: string
  appCardBg: string
}

export function androidTokens(theme: Theme): AndroidTokens {
  if (theme === 'dark') return {
    primary: '#8AB4F8',
    onPrimary: '#062E6F',
    surface: '#121212',
    surfaceContainer: '#1E1F20',
    surfaceContainerHigh: '#2A2B2D',
    onSurface: '#E8EAED',
    onSurfaceVariant: '#9AA0A6',
    outline: '#5F6368',
    outlineVariant: '#3C4043',
    primaryContainer: '#1E3A5F',
    onPrimaryContainer: '#D2E3FC',
    starFilled: '#F5A623',
    navBg: '#1E1F20',
    searchBg: '#2D2D2D',
    appCardBg: '#1E1F20',
  }
  return {
    primary: '#1A73E8',
    onPrimary: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceContainer: '#F1F3F4',
    surfaceContainerHigh: '#E8EAED',
    onSurface: '#202124',
    onSurfaceVariant: '#5F6368',
    outline: '#DADCE0',
    outlineVariant: '#E8EAED',
    primaryContainer: '#D2E3FC',
    onPrimaryContainer: '#062E6F',
    starFilled: '#1A73E8',
    navBg: '#FFFFFF',
    searchBg: '#F1F3F4',
    appCardBg: '#FFFFFF',
  }
}

export const mdType = {
  labelSmall: 11,
  labelMedium: 12,
  bodySmall: 12,
  bodyMedium: 14,
  bodyLarge: 16,
  titleSmall: 14,
  titleMedium: 16,
  titleLarge: 22,
  headlineSmall: 24,
} as const
