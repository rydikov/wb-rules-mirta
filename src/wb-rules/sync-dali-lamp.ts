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

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/ct-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay ct-request topic value: {}'.format(message.value))
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/brightness-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay brightness-request topic value: {}'.format(message.value))
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/status-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay status-request topic value: {}'.format(message.value))
})
