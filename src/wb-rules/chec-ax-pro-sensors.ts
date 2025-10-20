// Проверяем что данные корректно приходят от Ax-Pro, если нет или датчик offline, то принудительно ставим все контролы в ошибку
import { AxProSensors } from '#wbm/global-devices'
import { checkAvailability } from '#wbm/helpers'

defineRule('CHECK_AXPRO_SENSORS', {
  when: cron('@hourly'),
  then: function () {
    AxProSensors.forEach((d) => {
      const device = getDevice(d.id)

      if (device !== undefined) {
        const last_seen_timestamp = Number(device.getControl('last_seen_timestamp').getValue())

        let err_msg = checkAvailability(last_seen_timestamp) ? 'r' : ''

        if (err_msg === 'r') {
          device.getControl('is_updated').setValue(false)
        }
        else {
          device.getControl('is_updated').setValue(true)
        }

        if (device.getControl('status').getValue() === 'offline') {
          err_msg = 'r'
        }

        device.controlsList().forEach(function (ctrl) {
          ctrl.setError(err_msg)
        })
      }
    })
  },
})
