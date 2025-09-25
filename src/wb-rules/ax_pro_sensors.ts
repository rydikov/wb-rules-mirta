// Синхронизация температуры датчиков охранной системы с виртуальными устройством ВБ
// AxPro пишет своё состояние в корневой топпик ax-pro-xx где xx это номер датчика
// При изменении топика, значения из него присваиваются значению виртуального устройства AxPro
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

const cells: WbRules.ControlOptionsTree = {
  temperature: {
    title: 'Температура',
    type: 'value',
    units: 'deg C',
    value: 0,
    order: 0,
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
  last_seen_timestamp: {
    title: 'Последний раз в сети',
    type: 'value',
    value: 0,
    precision: 1,
  },
}

// Генерация виртуальных устройств для датчиков Ax-Pro
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

// Переводим timestamp в формат DD.MM.YYYY HH:MM:SS
function formatTimestampES5(last_seen) {
  const date = new Date(last_seen * 1000)

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
    device.getControl('temperature').setValue(value.temperature)
    device.getControl('charge_value').setValue('chargeValue' in value ? value.chargeValue : 0)
    device.getControl('status').setValue(value.status)
    device.getControl('last_seen_timestamp').setValue(value.last_seen)
    device.getControl('last_seen').setValue(formatTimestampES5(value.last_seen))

    if (device.isControlExists('humidity')) {
      device.getControl('humidity').setValue('humidity' in value ? value.humidity : 0)
    };
  }
})

// Проверяем что данные корректно приходят от Ax-Pro, если нет или датчик offline, то принудительно ставим все контролы в ошибку
defineRule('CHECK_AXPRO_SENSORS', {
  when: cron('@hourly'),
  then: function () {
    devices.forEach((d) => {
      const device = getDevice(d.id)

      if (device !== undefined) {
        const tsNow = Date.now() * 1000

        const last_seen_timestamp_ctrl = device.getControl('last_seen_timestamp')
        const last_seen_timestamp = last_seen_timestamp_ctrl.getValue()

        if (typeof (last_seen_timestamp) !== 'number') {
          throw new Error(`${last_seen_timestamp} не является числом`)
        }

        // 3600 = 1 hour
        let err_msg = last_seen_timestamp - tsNow > 3600 ? 'p' : ''

        const status_ctrl = device.getControl('status')
        const status = status_ctrl.getValue()
        if (status === 'offline') {
          err_msg = 'r'
        }

        // device.setError('p')
        device.controlsList().forEach(function (ctrl) {
          ctrl.setError(err_msg)
        })
      }
    })
  },
})
