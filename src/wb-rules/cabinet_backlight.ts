import { PresenceSensors, AstroTimer } from '@wbm/global_devices'

defineRule('CABINET_BACKLIGHT', {
  whenChanged: [PresenceSensors.Сabinet_01.presence_status_topic],
  then: function (newValue, devName, cellName) {
    log.debug('New value {}'.format(newValue))
    log.debug(devName)
    log.debug(cellName)
    log.debug('Is day {}'.format(AstroTimer.is_day))
  },
})
