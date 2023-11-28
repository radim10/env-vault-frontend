export function getOsAndBrowser(userAgent: string) {
  // Use regular expressions to extract OS and browser information
  const os = /(Windows|Mac OS|Linux|Android|iOS)/.exec(userAgent)
  const browser = /(Chrome|Firefox|Safari|Edge|MSIE|Opera)/.exec(userAgent)

  // Check if the match was found, otherwise set to "Unknown"
  const osName = os ? os[0] : 'Unknown OS'
  const browserName = browser ? browser[0] : 'Unknown Browser'

  return { os: osName, browser: browserName }
}
