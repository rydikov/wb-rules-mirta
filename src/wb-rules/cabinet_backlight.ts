import { PresenceSensors } from '@wbm/global_devices'

defineRule('CABINET_BACKLIGHT', {
  whenChanged: [PresenceSensors.Сabinet_01.presence_status_topic],
  then: function (newValue, devName, cellName) {
    log.debug(newValue)
    log.debug(devName)
    log.debug(cellName)
  },
})
