export const convertCurrentcy = (value: number, digit = 2) =>
  new Intl.NumberFormat('de-DE', {
    minimumFractionDigits: digit
  }).format(value)

export const convertDigitalNumber = (value: number, digit = 0) =>
  new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: digit
  }).format(value)

export const rateSale = (original: number, sale: number) =>
  Math.round(((original - sale) / original) * 100) + '%'

export const joinKeySearch =
  <T>(o: T) =>
  (fieldsToUpdate: Partial<T>) => {
    return `/?${Object.entries({ ...o, ...fieldsToUpdate })
      .map(([key, value]) => `${key}=${value}`)
      .join('&')}`
  }

const removeSpecialCharacter = (str: string) =>
  // eslint-disable-next-line no-useless-escape
  str.replace(
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    ''
  )

export const initId = (text: string, character = '-') => {
  return removeSpecialCharacter(text).replaceAll(/\s+/g, character)
}

export const getTimeToIso = (iso: string) => {
  return iso.split('T')[0].split('-').reverse().join('-')
}
