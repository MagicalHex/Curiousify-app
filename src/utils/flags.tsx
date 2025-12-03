// src/utils/flags.ts
const countryCodeToEmoji = (code: string): string => {
  if (!code || code.length !== 2) return ''
  return code
    .toUpperCase()
    .split('')
    .map(char => String.fromCodePoint(0x1F1E6 + char.charCodeAt(0) - 65))
    .join('')
}

const countryNameToCode: Record<string, string> = {
  poland: 'PL',
  france: 'FR',
  japan: 'JP',
  brazil: 'BR',
  germany: 'DE',
  usa: 'US',
  uk: 'GB',
  canada: 'CA',
  australia: 'AU',
  india: 'IN',
  china: 'CN',
  russia: 'RU',
  italy: 'IT',
  spain: 'ES',
  mexico: 'MX',
  argentina: 'AR',
  southkorea: 'KR',
  sweden: 'SE',
  norway: 'NO',
  denmark: 'DK',
  finland: 'FI',
  netherlands: 'NL',
  belgium: 'BE',
  austria: 'AT',
  switzerland: 'CH',
  portugal: 'PT',
  greece: 'GR',
  turkey: 'TR',
  egypt: 'EG',
  israel: 'IL',
  uae: 'AE',
  saudi: 'SA',
  southafrica: 'ZA',
  nigeria: 'NG',
  kenya: 'KE',
  newzealand: 'NZ',
  ireland: 'IE',
  iceland: 'IS',
  thailand: 'TH',
  vietnam: 'VN',
  indonesia: 'ID',
  philippines: 'PH',
  malaysia: 'MY',
  singapore: 'SG',
  chile: 'CL',
  colombia: 'CO',
  peru: 'PE',
  ukraine: 'UA',
  czechrepublic: 'CZ',
  hungary: 'HU',
  romania: 'RO',
  croatia: 'HR',
  serbia: 'RS',
  slovakia: 'SK',
  lithuania: 'LT',
  latvia: 'LV',
  estonia: 'EE',
} as const

/** Convert a country name (as used in your facts) → flag emoji */
export const getFlagEmoji = (countryName: string): string => {
  if (!countryName) return ''
  const key = countryName.toLowerCase().replace(/\s+/g, '')
  const code = countryNameToCode[key as keyof typeof countryNameToCode]
  return code ? countryCodeToEmoji(code) : ''
}

/** Keep your old function for category-based facts */
export const getFlagFromCategory = (category: string): string => {
  if (!category) return ''
  const match = category.match(/Countries > (\w+)/i)
  if (!match) return ''
  const key = match[1].toLowerCase().replace(/\s+/g, '')
  const code = countryNameToCode[key as keyof typeof countryNameToCode]
  return code ? countryCodeToEmoji(code) : ''
}