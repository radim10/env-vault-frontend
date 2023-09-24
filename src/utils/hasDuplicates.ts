function hasDuplicates<T>(array: T[], property: keyof T): boolean {
  const seen: { [key: string]: boolean } = {}
  for (const item of array) {
    const key = String(item[property]) // Convert the property to a string
    if (seen[key]) {
      return true // Duplicate found
    }
    seen[key] = true
  }
  return false // No duplicates found
}

export default hasDuplicates
