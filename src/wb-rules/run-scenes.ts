import { getDeviceAddress } from '#wbm/classes/dlc-02'
import { dlc02 } from '#wbm/global-devices'

defineVirtualDevice('scenes', {
  title: 'Сценарии',
  cells: {
    'relax_evening': { type: 'pushbutton' },
    'movie_night': { type: 'pushbutton' },
    'morning_routine': { type: 'pushbutton' },
  },
})

defineRule('Scene_Control', {
  whenChanged: ['scenes/relax_evening', 'scenes/movie_night', 'scenes/morning_routine'],
  then: function (newValue, devName, cellName) {
    log.debug(newValue)
    log.debug(devName)
    log.debug(cellName)

    if (cellName == 'relax_evening') {
      // log.debug('Сцена Расслабляющий вечер активирована')
      log.info('get-ct')
      dlc02.sendColorTemperatureRequest('01', getDeviceAddress(1))
    }
    if (cellName == 'movie_night') {
      // log.debug('Сцена Киновечер активирована')
      log.info('get-brightness')
      dlc02.sendBrightnessRequest('01', getDeviceAddress(1))
    }
    if (cellName == 'morning_routine') {
      // log.debug('Сцена Утро активирована')
      log.info('get-status')
      dlc02.sendStatusRequest('01', getDeviceAddress(1))
    }
  },
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/ct-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay topic value: {}'.format(message.value))
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/brightness-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay topic value: {}'.format(message.value))
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/status-request/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay topic value: {}'.format(message.value))
})
