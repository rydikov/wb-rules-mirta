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

// TODO: Remove values, not used
const patritionsWithDevaces: Record<string, string> = {
  '01': 'AxPro/state_01',
  '02': 'AxPro/state_02',
  '03': 'AxPro/state_03',
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

  const { cia_code, group_or_partition_number } = JSON.parse(message.value) as PartitionMessage

  const state = ciaToState[cia_code]

  if (state && group_or_partition_number in patritionsWithDevaces) {

    dev[`AxPro/state_0${group_or_partition_number}`] = state

  }

})

defineRule('ArmGroundFloor', {
  whenChanged: 'AxPro/state_01',
  then: function (newValue) {

    if (newValue == 1) {

      log.info('Подвал поставлен на охрану')
      dev['wb-mr6cv3_217/K6'] = false

    }

  },
})
