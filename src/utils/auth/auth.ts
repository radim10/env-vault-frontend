const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const upperCaseRegex = /[A-Z]/
const lowerCaseRegex = /[a-z]/
const numberRegex = /\d/

export const passwordRules = [
  {
    name: 'Minimum 10 characters',
    check: (password: string) => password.length >= 10,
  },
  {
    name: 'At least 1 uppercase letter',
    check: (password: string) => upperCaseRegex.test(password),
  },
  {
    name: 'At least 1 lowercase letter',
    check: (password: string) => lowerCaseRegex.test(password),
  },
  {
    name: 'At least 1 number',
    check: (password: string) => numberRegex.test(password),
  },
]

export const authRegex = {
  email: emailRegex,
  password: {
    upperCase: upperCaseRegex,
    lowerCase: lowerCaseRegex,
    number: numberRegex,
  },
  // passwordUpperCase: upperCaseRegex,
  // passwordLowerCase: lowerCaseRegex,
  // passwordNumber: numberRegex,
}
