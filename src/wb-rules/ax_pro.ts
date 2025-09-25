import { AxProAreas } from '@wbm/global_devices'

const axProStates = {
  1: { en: 'Armed', ru: 'Под охраной' },
  2: { en: 'Stay armed', ru: 'Ночной режим' },
  3: { en: 'Disarmed', ru: 'Снято с охраны' },
  4: { en: 'Status unknown', ru: 'Состояние неизвестно' },
}

const ciaToState: Record<string, number> = {
  '3401': 1,
  '3441': 2,
  '1401': 3,
}

const patritionsWithDevaces: Record<string, string> = {
  '01': AxProAreas['GroundFloor'],
  '02': AxProAreas['Bar'],
  '03': AxProAreas['Outdoor'],
}

defineVirtualDevice('AxPro', {
  title: { en: 'Ax Pro', ru: 'Ax Pro' },
  cells: {
    state_01: {
      title: { en: 'Ground floor', ru: 'Подвал' },
      type: 'value',
      value: 4,
      enum: axProStates,
    },
    state_02: {
      title: { en: 'Bar', ru: 'Бар' },
      type: 'value',
      value: 4,
      enum: axProStates,
    },
    state_03: {
      title: { en: 'Outdoor', ru: 'Улица' },
      type: 'value',
      value: 4,
      enum: axProStates,
    },
  },
})

// Тип данных из MQTT
interface PartitionMessage {
  cia_code: string
  group_or_partition_number: string
}

// Sync with virtual device
trackMqtt('ax-pro/partitions/#', (message: { topic: string, value: string }) => {
  log.debug('name: {}, value: {}'.format(message.topic, message.value))

  const value = JSON.parse(message.value) as PartitionMessage

  const state = ciaToState[value.cia_code]
  const partition = patritionsWithDevaces[value.group_or_partition_number]

  const control = getControl(partition)

  if (state && control) {
    control.setValue(state)
  }
})
