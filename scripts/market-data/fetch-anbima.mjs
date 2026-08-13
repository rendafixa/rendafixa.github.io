export function parseAnbimaHolidays(html, year) {
  return extractTagContents(html, 'tr').flatMap((row) => {
    const cells = extractTagContents(row, 'td')
      .map(cell => decodeHtml(stripTags(cell).replace(/\s+/g, ' ').trim()))
    const date = /^(\d{1,2})\/(\d{1,2})\/(\d{2}|\d{4})$/.exec(cells[0] ?? '')
    if (!date) return []
    const fullYear = date[3].length === 2 ? 2000 + Number(date[3]) : Number(date[3])
    if (fullYear !== year || !cells[2]) return []
    return [{
      date: `${fullYear}-${date[2].padStart(2, '0')}-${date[1].padStart(2, '0')}`,
      name: cells[2],
    }]
  })
}

function stripTags(value) {
  let output = ''
  let insideTag = false
  for (const character of value) {
    if (character === '<') insideTag = true
    else if (character === '>') {
      insideTag = false
      output += ' '
    }
    else if (!insideTag) output += character
  }
  return output
}

function extractTagContents(html, tag) {
  const lowerHtml = html.toLowerCase()
  const opening = `<${tag}`
  const closing = `</${tag}>`
  const contents = []
  let cursor = 0
  while (cursor < html.length) {
    const openingStart = findOpeningTag(lowerHtml, opening, cursor)
    if (openingStart < 0) break
    const contentStart = lowerHtml.indexOf('>', openingStart + opening.length)
    if (contentStart < 0) break
    const contentEnd = lowerHtml.indexOf(closing, contentStart + 1)
    if (contentEnd < 0) break
    contents.push(html.slice(contentStart + 1, contentEnd))
    cursor = contentEnd + closing.length
  }
  return contents
}

function findOpeningTag(html, opening, fromIndex) {
  let index = html.indexOf(opening, fromIndex)
  while (index >= 0) {
    const nextCharacter = html[index + opening.length]
    if (nextCharacter === '>' || /\s/.test(nextCharacter)) return index
    index = html.indexOf(opening, index + opening.length)
  }
  return -1
}

function decodeHtml(value) {
  const named = {
    amp: '&', apos: '\'', quot: '"', nbsp: ' ', lt: '<', gt: '>',
    aacute: 'á', Aacute: 'Á', acirc: 'â', Acirc: 'Â', atilde: 'ã', Atilde: 'Ã',
    ccedil: 'ç', Ccedil: 'Ç', eacute: 'é', Eacute: 'É', ecirc: 'ê', Ecirc: 'Ê',
    iacute: 'í', Iacute: 'Í', oacute: 'ó', Oacute: 'Ó', ocirc: 'ô', Ocirc: 'Ô',
    otilde: 'õ', Otilde: 'Õ', uacute: 'ú', Uacute: 'Ú',
  }
  return value.replace(/&#(\d+);|&#x([\da-f]+);|&([a-z]+);/gi, (entity, decimal, hexadecimal, name) => {
    if (decimal) return String.fromCodePoint(Number(decimal))
    if (hexadecimal) return String.fromCodePoint(Number.parseInt(hexadecimal, 16))
    return named[name] ?? entity
  })
}

export async function fetchAnbimaYear(year, options = {}) {
  const url = `https://www.anbima.com.br/feriados/fer_nacionais/${year}.asp`
  const fetchImpl = options.fetchImpl ?? fetch
  const retries = options.retries ?? 3
  let lastError
  for (let attempt = 1; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? 10_000)
    try {
      const response = await fetchImpl(url, { signal: controller.signal, headers: { 'User-Agent': 'rendafixa-updater/2.0 (+https://github.com/rendafixa/rendafixa.github.io)' } })
      if (!response.ok) throw new Error(`ANBIMA ${year}: HTTP ${response.status}`)
      return parseAnbimaHolidays(await response.text(), year)
    }
    catch (error) {
      lastError = error
      if (attempt < retries) await new Promise(resolve => setTimeout(resolve, options.backoffMs ?? 250))
    }
    finally {
      clearTimeout(timeout)
    }
  }
  throw lastError
}

export async function fetchAnbimaRange(fromYear, untilYear, options = {}) {
  const dates = []
  let supportedUntil = `${fromYear - 1}-12-31`
  for (let year = fromYear; year <= untilYear; year++) {
    try {
      const holidays = await fetchAnbimaYear(year, options)
      if (!holidays.length) {
        if (!dates.length) throw new Error(`ANBIMA ${year}: no holidays found`)
        break
      }
      dates.push(...holidays)
      supportedUntil = `${year}-12-31`
    }
    catch {
      if (!dates.length) throw new Error(`ANBIMA unavailable from ${fromYear}`)
      break
    }
  }
  return { supportedFrom: `${fromYear}-01-01`, supportedUntil, dates }
}
