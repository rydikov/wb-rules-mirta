// Синхронизация температуры датчиков охранной системы с виртуальными устройством ВБ
// AxPro пишет своё состояние в корневой топпик ax-pro-xx где xx это номер датчика
// При изменении топика, значения из него присваиваются значению виртуального устройства AxPro
import { formatTimestampES5, checkAvailability } from '#wbm/helpers'

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

interface SensorMessage {
  temperature: string
  chargeValue: string
  status: string
  last_seen: number
  humidity: string
}

// Sync with virtual device
trackMqtt('ax-pro/sensors/#', (message: { topic: string, value: string }) => {
  const value = JSON.parse(message.value) as SensorMessage

  const parts = message.topic.split('/')
  const sensorId = parts[2] // sensor_id
  const devName = 'ax-pro-' + sensorId

  const device = getDevice(devName)

  if (device !== undefined) {
    device.getControl('temperature').setValue(value.temperature)
    device.getControl('charge_value').setValue('chargeValue' in value ? value.chargeValue : 0)
    device.getControl('status').setValue(value.status)
    device.getControl('last_seen_timestamp').setValue(value.last_seen)
    device.getControl('last_seen').setValue(formatTimestampES5(value.last_seen * 1000)) // s to ms

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
        const last_seen_timestamp = Number(device.getControl('last_seen_timestamp').getValue())

        let err_msg = checkAvailability(last_seen_timestamp) ? 'r' : ''

        if (device.getControl('status').getValue() === 'offline') {
          err_msg = 'r'
        }

        device.controlsList().forEach(function (ctrl) {
          ctrl.setError(err_msg)
        })
      }
    })
  },
})
