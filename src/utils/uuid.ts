export const uuidRegex =
  /[a-fA-F0-9]{8}-[a-fA-F0-9]{4}-4[a-fA-F0-9]{3}-[89aAbB][a-fA-F0-9]{3}-[a-fA-F0-9]{12}/

export function extractUUIDv4(inputString: string) {
  const match = inputString.match(uuidRegex)

  return match ? match[0] : null
}
