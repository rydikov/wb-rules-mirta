import { getDeviceAddress, getGroupAddress } from '#wbm/classes/dlc-02'
import { dlc02 } from '#wbm/global-devices'
import { formatTimestampES5 } from '#wbm/helpers'

defineVirtualDevice('dali_group_0', {
  title: 'G00 Кабинет: Точечные светильники',
  cells: {
    status: {
      order: 10,
      title: 'Группа включена',
      type: 'switch',
      value: false,
      readonly: true,
    },
    update: {
      order: 20,
      title: 'Обновить',
      type: 'pushbutton',
    },
    updated: {
      order: 30,
      title: 'Обновлено',
      type: 'text',
      value: '',
    },
    color_temperature: {
      order: 40,
      title: 'Цветовая температура',
      type: 'range',
      min: 2700,
      max: 6500,
      value: 2700,
      readonly: false,
    },
    brightness: {
      order: 50,
      title: 'Яркость',
      type: 'range',
      min: 0,
      max: 254,
      value: 0,
      readonly: false,
    },
  },
})

defineRule('DALI_GROUP_0_SETUP_BRIGHTNESS', {
  whenChanged: 'dali_group_0/brightness',
  then: function (newValue: number) {
    dlc02.setBrightness('01', getGroupAddress(0), newValue)
  },
})

// defineRule('DALI_GROUP_0_SETUP_STATUS', {
//   whenChanged: 'dali_group_0/status',
//   then: function (newValue: boolean) {
//     if (newValue) {
//       dlc02.onGroup('01', 0)
//     }
//     else {
//       dlc02.offGroup('01', 0)
//     }
//   },
// })

defineRule('DALI_GROUP_0_SETUP_COLOR_TEMPERATURE', {
  whenChanged: 'dali_group_0/color_temperature',
  then: function (newValue: number) {
    dlc02.setColorTemperature('01', getGroupAddress(0), newValue)
  },
})

defineRule('CHECK_DALI_LAMP_0', {
  whenChanged: 'dali_group_0/update',
  then: function () {
    const lampAddress = getDeviceAddress(1)
    log.info('get-ct request')
    dlc02.sendColorTemperatureRequest('01', lampAddress)
    log.info('get-brightness request')
    dlc02.sendBrightnessRequest('01', lampAddress)
    log.info('get-status request')
    dlc02.sendStatusRequest('01', lampAddress)

    const now = new Date()
    getDevice('dali_group_0')?.getControl('updated').setValue(formatTimestampES5(now.getTime()))
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
    return
  }

  const colorTemperature = parseColourTemperature(frame[4], frame[5])
  getDevice('dali_group_0')?.getControl('color_temperature').setValue(colorTemperature)
})

// Обновляем яркость
trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/brightness-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay brightness-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)

  const errorDetails = checkErrorFrame(frame)
  if (errorDetails !== null) {
    log.error('brightness-request failed: {}'.format(errorDetails))
    return
  }

  const brightness = parseBrightness(frame[4])
  getDevice('dali_group_0')?.getControl('brightness').setValue(brightness)
})

// Обновляем статус
trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/status-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay status-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)

  const errorDetails = checkErrorFrame(frame)
  if (errorDetails !== null) {
    log.error('status-request failed: {}'.format(errorDetails))
    return
  }

  const status = parseStatus(frame[4])
  getDevice('dali_group_0')?.getControl('status').setValue(status)
})
