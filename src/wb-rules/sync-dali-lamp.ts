import { getDeviceAddress, getGroupAddress } from '#wbm/classes/dlc-02'
import { dlc02 } from '#wbm/global-devices'
import { formatTimestampES5 } from '#wbm/helpers'

defineVirtualDevice('dali_groups', {
  title: 'Dali Groups Tester',
  cells: {
    buss_id: {
      order: 0,
      title: 'Шина',
      type: 'text',
      value: '01',
      readonly: false,
      enum: {
        '01': { en: 'A', ru: 'A' },
        '02': { en: 'B', ru: 'B' },
      },
    },
    group_id: {
      order: 10,
      title: 'ID Группы',
      type: 'value',
      value: 0,
      readonly: false,
      enum: {
        0: { en: '0', ru: '0' },
        1: { en: '1', ru: '1' },
        2: { en: '2', ru: '2' },
        3: { en: '3', ru: '3' },
        4: { en: '4', ru: '4' },
        5: { en: '5', ru: '5' },
        6: { en: '6', ru: '6' },
        7: { en: '7', ru: '7' },
        8: { en: '8', ru: '8' },
        9: { en: '9', ru: '9' },
        10: { en: '10', ru: '10' },
        11: { en: '11', ru: '11' },
        12: { en: '12', ru: '12' },
        13: { en: '13', ru: '13' },
        14: { en: '14', ru: '14' },
        15: { en: '15', ru: '15' },
      },
    },
    brightness: {
      order: 20,
      title: 'Яркость',
      type: 'range',
      min: 0,
      max: 254,
      value: 0,
      readonly: false,
    },
    color_temperature: {
      order: 30,
      title: 'Цветовая температура',
      type: 'range',
      min: 2700,
      max: 6500,
      value: 2700,
      readonly: false,
    },

    device_id: {
      order: 40,
      title: 'ID устройства для синхронизации',
      type: 'value',
      value: 0,
      readonly: false,
      min: 0,
      max: 63,
    },
    update: {
      order: 50,
      title: 'Синхронизировать',
      type: 'pushbutton',
    },
    updated: {
      order: 60,
      title: 'Обновлено',
      type: 'text',
      value: '',
    },
    status_updated: {
      order: 70,
      title: 'Статус',
      type: 'text',
      value: '',
    },
    color_temperature_updated: {
      order: 80,
      title: 'Цветовая температура',
      type: 'text',
      value: '',
    },
    brightness_updated: {
      order: 90,
      title: 'Яркость',
      type: 'text',
      value: '',
    },
  },
})

defineRule('DALI_GROUP_SET_BRIGHTNESS', {
  whenChanged: 'dali_groups/brightness',
  then: function (newValue: number) {
    const groupAddress = Number(getDevice('dali_groups')?.getControl('group_id').getValue())
    const bussID = String(getDevice('dali_groups')?.getControl('buss_id').getValue())

    dlc02.setBrightness(bussID, getGroupAddress(groupAddress), newValue)
  },
})

defineRule('DALI_GROUP_SET_COLOR_TEMPERATURE', {
  whenChanged: 'dali_groups/color_temperature',
  then: function (newValue: number) {
    const groupAddress = Number(getDevice('dali_groups')?.getControl('group_id').getValue())
    const bussID = String(getDevice('dali_groups')?.getControl('buss_id').getValue())

    dlc02.setColorTemperature(bussID, getGroupAddress(groupAddress), newValue)
  },
})

defineRule('CHECK_DALI_LAMP', {
  whenChanged: 'dali_groups/update',
  then: function () {
    const lampAddress = getDevice('dali_groups')?.getControl('device_id').getValue()
    const deviceLampAddress = getDeviceAddress(Number(lampAddress))

    const bussID = String(getDevice('dali_groups')?.getControl('buss_id').getValue())

    log.info('get-ct request for lamp {} on buss {}'.format(deviceLampAddress, bussID))
    dlc02.sendColorTemperatureRequest(bussID, deviceLampAddress)
    log.info('get-brightness request for lamp {} on buss {}'.format(deviceLampAddress, bussID))
    dlc02.sendBrightnessRequest(bussID, deviceLampAddress)
    log.info('get-status request for lamp {} on buss {}'.format(deviceLampAddress, bussID))
    dlc02.sendStatusRequest(bussID, deviceLampAddress)

    const now = new Date()
    getDevice('dali_groups')?.getControl('updated').setValue(formatTimestampES5(now.getTime()))
  },
})

// Парсим ответ во фрейм "0101010119870000" -> [1, 1, 1, 1, 25, 135, 0, 0], одно и тоже [0x01, 0x01, 0x01, 0x01, 0x19, 0x87, 0x00, 0x00]
function hexToFrame(hex: string): number[] {
  const frame: number[] = []

  for (let i = 0; i < hex.length; i += 2) {
    frame.push(parseInt(hex.substring(i, i + 2), 16))
  }

  return frame
}

/**
 * По спецификации Definition of colour temperature Byte 4 - Byte 7: colour temperature value 0(high/low):
 * - Byte 4 = старший байт (High byte)
 * - Byte 5 = младший байт (Low byte)
 */

function parseColourTemperature(
  byte4: number,
  byte5: number
): number {
  const kelvin = (byte4 << 8) | byte5
  return kelvin
}

/**
 * По спецификации Definition of brightness value (Byte 4, Byte 5-7 is 0): 0-254:
 * - значение яркости находится в Byte 4
 * - Byte 5-7 должны быть равны 0
 * - значение яркости находится в диапазоне 0..254
 */
function parseBrightness(byte4: number): number {
  return byte4
}

/**
 * По спецификации Status value definition (Byte 4, Byte 5-7 are 0): Bit 0: Drive failure, Bit 1: Lamp failure, Bit 2: The light is on:
 * - status value находится в Byte 4
 * - Bit 2 (byte4 & 0x04) = The light is on
 */
function parseStatus(byte4: number): boolean {
  return (byte4 & 0x04) !== 0
}

/**
 * Проверяет, является ли ответ error frame, и возвращает детализацию ошибки.
 *
 * По спецификации:
 * - Byte 3 = 7 -> Error message
 * - Byte 7 = код ошибки:
 *   - 1 -> DALI line short circuit
 *   - 2 -> DALI receive error
 *
 * Если ошибки нет, возвращает `null`.
 */
function checkErrorFrame(frame: number[]): string | null {
  if (frame[3] !== 7) {
    return null
  }

  const errorCode = frame[7]
  let errorDetails = 'Unknown error'

  if (errorCode === 1) {
    errorDetails = 'DALI line short circuit'
  }
  else if (errorCode === 2) {
    errorDetails = 'DALI receive error'
  }

  return 'Error: {} ({})'.format(errorCode, errorDetails)
}

interface RpcReplyPayload {
  result: {
    response: string
  }
}

// Обновляем цветовую температуру
trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/ct-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay ct-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)

  const errorDetails = checkErrorFrame(frame)
  if (errorDetails !== null) {
    log.error('ct-request failed: {}'.format(errorDetails))
    getDevice('dali_groups')?.getControl('color_temperature_updated').setValue('Failed: {}'.format(errorDetails))
    return
  }

  const colorTemperature = parseColourTemperature(frame[4], frame[5])
  getDevice('dali_groups')?.getControl('color_temperature_updated').setValue('{} K'.format(colorTemperature))
})

// Обновляем яркость
trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/brightness-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay brightness-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)

  const errorDetails = checkErrorFrame(frame)
  if (errorDetails !== null) {
    log.error('brightness-request failed: {}'.format(errorDetails))
    getDevice('dali_groups')?.getControl('brightness_updated').setValue('Failed: {}'.format(errorDetails))
    return
  }

  const brightness = parseBrightness(frame[4])
  getDevice('dali_groups')?.getControl('brightness_updated').setValue(brightness.toString())
})

// Обновляем статус
trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/status-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay status-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)

  const errorDetails = checkErrorFrame(frame)
  if (errorDetails !== null) {
    log.error('status-request failed: {}'.format(errorDetails))
    getDevice('dali_groups')?.getControl('status_updated').setValue('Failed: {}'.format(errorDetails))
    return
  }

  const status = parseStatus(frame[4]) ? 'Включено' : 'Выключено'

  getDevice('dali_groups')?.getControl('status_updated').setValue(status)
})
