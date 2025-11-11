export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

export function cn(...classes: (string | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getColorClasses(color: string): { bg: string; dark: string } {
  const colorMap: Record<string, { bg: string; dark: string }> = {
    purple: {
      bg: 'bg-soft-purple',
      dark: 'text-soft-purple-dark',
    },
    teal: {
      bg: 'bg-soft-teal',
      dark: 'text-soft-teal-dark',
    },
    orange: {
      bg: 'bg-soft-orange',
      dark: 'text-soft-orange-dark',
    },
    pink: {
      bg: 'bg-soft-pink',
      dark: 'text-soft-pink-dark',
    },
    blue: {
      bg: 'bg-soft-blue',
      dark: 'text-soft-blue-dark',
    },
    green: {
      bg: 'bg-soft-green',
      dark: 'text-soft-green-dark',
    },
  }
  return colorMap[color] || colorMap.purple
}

export function getColorBgClasses(color: string): string {
  const colorMap: Record<string, string> = {
    purple: 'bg-soft-purple/20',
    teal: 'bg-soft-teal/20',
    orange: 'bg-soft-orange/20',
    pink: 'bg-soft-pink/20',
    blue: 'bg-soft-blue/20',
    green: 'bg-soft-green/20',
  }
  return colorMap[color] || 'bg-soft-purple/20'
}
