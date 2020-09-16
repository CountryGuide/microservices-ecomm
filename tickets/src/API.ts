export const baseUrl = '/api/tickets'

export const TicketsAPI = {
  create: baseUrl,
  read: baseUrl,
  update: url`${baseUrl}/${'id'}`,
  delete: url`${baseUrl}/${'id'}`,
}

type Dict = { [key: string]: string | number }

function url(strings: TemplateStringsArray, ...keys: (string | number)[]) {
  return function (...values: []) {
    const dict: Dict = values[values.length - 1] || {}
    const result = [strings[0]]
    keys.forEach(function (key: string | number, i) {
      const value = Number.isInteger(key) ? values[key as number] : dict[key]
      result.push(value as string, strings[i + 1])
    })
    return result.join('')
  }
}
