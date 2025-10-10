// Проверяем что данные корректно приходят от Датчиков Aqara
import { AqaraSensors } from '@wbm/global_devices'
import { sendTgMessage } from '#wbm/telegram'
import { objectValues, checkAvailability } from '#wbm/helpers'

defineRule('CHECK_AQARA_SENSORS', {
  when: cron('@hourly'),
  then: function () {
    objectValues(AqaraSensors).forEach((d) => {
      const device = getDevice(d)

      if (device !== undefined) {
        const last_seen_timestamp = Number(device.getControl('last_seen').getValue())

        const err_msg = checkAvailability(last_seen_timestamp / 1000) ? 'p' : ''

        device.controlsList().forEach(function (ctrl) {
          ctrl.setError(err_msg)
        })
        if (err_msg === 'p') {
          sendTgMessage('Датчик Aqara {} не передает состояние'.format(d))
        }
      }
    })
  },
})
