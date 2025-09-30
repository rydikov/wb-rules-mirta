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
