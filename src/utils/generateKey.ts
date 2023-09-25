import { customAlphabet, nanoid } from 'nanoid'

const alpahumeric = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789')
const hex = customAlphabet('0123456789ABCDEF')
const base64 = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/')
const base64Url = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_')

export enum Alphabet {
  Alpahumeric = 'Alpahumeric',
  Hexadecimal = 'Hexadecimal',
  Base64 = 'Base64',
  Base64Url = 'Base64Url',
}

const generateKey = (type?: Alphabet, length?: number) => {
  switch (type) {
    case Alphabet.Alpahumeric:
      return alpahumeric(length)
    case Alphabet.Hexadecimal:
      return hex(length)
    case Alphabet.Base64:
      return base64(length)
    case Alphabet.Base64Url:
      return base64Url(length)
  }
}

export { generateKey }
