// Проверяем что данные корректно приходят от Датчиков Aqara
import { AqaraSensors } from '@wbm/global_devices'
import { objectValues, checkAvailability } from '#wbm/helpers'

defineRule('CHECK_AQARA_SENSORS', {
  when: cron('@hourly'),
  then: function () {
    objectValues(AqaraSensors).forEach((d) => {
      const device = getDevice(d)

      if (device !== undefined) {
        const last_seen_timestamp = Number(device.getControl('last_seen').getValue())

        const err_msg = checkAvailability(last_seen_timestamp / 1000) ? 'r' : ''

        device.controlsList().forEach(function (ctrl) {
          ctrl.setError(err_msg)
        })
      }
    })
  },
})
