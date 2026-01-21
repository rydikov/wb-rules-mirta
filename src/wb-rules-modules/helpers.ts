// Переводим timestamp в формат DD.MM.YYYY HH:MM:SS
export function formatTimestampES5(last_seen: number) {
  const date = new Date(last_seen)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // Дополняем нулями для красоты
  function pad(n: number) {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return n < 10 ? '0' + n : n
  }

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return pad(day) + '.' + pad(month) + '.' + year + ' ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)
};

// Object.values(obj) for ES5
export function objectValues<T extends Record<string, unknown>>(obj: T): T[keyof T][] {
  const arr: T[keyof T][] = []
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      arr.push(obj[key])
    }
  }
  return arr
}

// return true if available
export function checkAvailability(
  last_seen: number,
  ttlSeconds = 3600 // 1 hour
): boolean {
  const tsNow = Date.now() / 1000 // convert to sec
  return tsNow - last_seen < ttlSeconds
}
