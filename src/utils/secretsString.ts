import { Secret } from '@/types/secrets'

export const getSecretsString = (secrets: Secret[], type: 'dotenv' | 'json'): string => {
  if (type === 'dotenv') {
    const dotenvString = secrets
      .map((obj) => {
        if (obj.description) {
          return `# ${obj.description}\n${obj.key}=${obj.value}`
        } else {
          return `${obj.key}=${obj.value}`
        }
      })
      .join('\n')

    return dotenvString
  } else {
    const resultObject: { [key: string]: string } = secrets.reduce((acc: any, obj: any) => {
      acc[obj.key] = obj.value
      return acc
    }, {})

    const jsonString = JSON.stringify(resultObject, null, 2)
    return jsonString
  }
}
