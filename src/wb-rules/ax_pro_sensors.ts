const cells: WbRules.ControlOptionsTree = {
  temperature: {
    title: 'Температура',
    type: 'value',
    units: 'deg C',
    value: 0,
  },
  charge_value: {
    title: 'Процент заряда',
    type: 'value',
    units: '%',
    value: 0,
  },
  status: {
    title: 'Статус',
    type: 'text',
    value: '',
  },
  last_seen: {
    title: 'Последний раз в сети',
    type: 'text',
    value: '',
  },
}

const devices = [
  { id: 'ax-pro-1', title: 'ДТ Улица', humidity: true },
  { id: 'ax-pro-2', title: 'ДТ Погреб', humidity: true },
  { id: 'ax-pro-3', title: 'ДД Бар' },
  { id: 'ax-pro-4', title: 'ДД Склад' },
  { id: 'ax-pro-6', title: 'ДО Спортазл' },
  { id: 'ax-pro-8', title: 'ДД Спортзал' },
  { id: 'ax-pro-10', title: 'ДО Бар' },
  { id: 'ax-pro-12', title: 'Датчик дыма отключен' },
  { id: 'ax-pro-13', title: 'Датчик дыма отключен' },
  { id: 'ax-pro-11', title: 'Уличная сирена' },
]

// eslint-disable-next-line @typescript-eslint/prefer-for-of
for (let i = 0; i < devices.length; i++) {

  const d = devices[i]
  const v_dev = defineVirtualDevice(d.id, {
    title: d.title,
    cells: cells,
  })
  if (d.humidity !== undefined) {

    v_dev.addControl('humidity', {
      title: 'Влажность',
      type: 'value',
      units: '%, RH',
      value: 0,
      max: 100,
      min: 1,
    })

  }

};

function formatTimestampES5(last_seen) {

  const date = new Date(last_seen * 1000)

  const day = date.getDate()
  const month = date.getMonth() + 1
  const year = date.getFullYear()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  // Дополняем нулями при необходимости
  function pad(n: number) {

    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return n < 10 ? '0' + n : n

  }

  // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  return pad(day) + '.' + pad(month) + '.' + year + ' ' + pad(hours) + ':' + pad(minutes) + ':' + pad(seconds)

};

interface SensorMessage {
  temperature: string
  chargeValue: string
  status: string
  last_seen: string
  humidity: string
}

// Sync with virtual device
trackMqtt('ax-pro/sensors/#', (message: { topic: string, value: string }) => {

  const value = JSON.parse(message.value) as SensorMessage
  log.debug(message.topic)

  const parts = message.topic.split('/')
  const sensorId = parts[2] // sensor_id
  const devName = 'ax-pro-' + sensorId

  const device = getDevice(devName)

  if (device !== undefined) {

    dev[`${devName}/temperature`] = value.temperature
    dev[`${devName}/charge_value`] = 'chargeValue' in value ? value.chargeValue : 0

    dev[`${devName}/status`] = value.status

    dev[`${devName}/last_seen`] = formatTimestampES5(value.last_seen)

    if (device.isControlExists('humidity')) {

      dev[`${devName}/humidity`] = 'humidity' in value ? value.humidity : 0

    };

  }

})
