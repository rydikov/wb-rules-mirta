import { getDeviceAddress } from '#wbm/classes/dlc-02'
import { dlc02 } from '#wbm/global-devices'

defineVirtualDevice('Lamp0', {
  title: 'DALI Lamp 0',
  cells: {
    update: {
      title: 'Обновить',
      type: 'pushbutton',
    },
    status: {
      title: 'Состояние',
      type: 'switch',
      readonly: true,
      value: false,
    },
    color_temperature: {
      title: 'Цветовая температура',
      type: 'value',
      readonly: true,
      value: 0,
    },
    brightness: {
      title: 'Яркость',
      type: 'value',
      readonly: true,
      value: 0,
    },
  },
})

defineRule('CHECK_DALI_LAMP_0', {
  whenChanged: 'Lamp0/update',
  then: function () {
    const lampAddress = getDeviceAddress(1)
    log.info('get-ct request')
    dlc02.sendColorTemperatureRequest('01', lampAddress)
    log.info('get-brightness request')
    dlc02.sendBrightnessRequest('01', lampAddress)
    log.info('get-status request')
    dlc02.sendStatusRequest('01', lampAddress)
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

interface RpcReplyPayload {
  result: {
    response: string
  }
}

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/ct-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay ct-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)
  const colorTemperature = parseColourTemperature(frame[4], frame[5])
  log.info(colorTemperature)
  getDevice('Lamp0')?.getControl('color_temperature').setValue(colorTemperature)
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/brightness-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay brightness-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)
  const brightness = parseBrightness(frame[4])
  log.info(brightness)
  getDevice('Lamp0')?.getControl('brightness').setValue(brightness)
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/status-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay status-request topic value: {}'.format(message.value))
  const payload = JSON.parse(message.value) as RpcReplyPayload
  const frame = hexToFrame(payload.result.response)
  const status = parseStatus(frame[4])
  log.info(status)
  getDevice('Lamp0')?.getControl('status').setValue(status)
})
