// Проверяем что данные корректно приходят от Датчиков Aqara
import { AqaraSensors } from '#wbm/global-devices'
import { objectValues, checkAvailability } from '#wbm/helpers'

defineRule('CHECK_AQARA_SENSORS', {
  when: cron('@hourly'),
  then: function () {
    objectValues(AqaraSensors).forEach((aqara_sernsor) => {
      const err_msg = checkAvailability(aqara_sernsor.last_seen / 1000) ? '' : 'r'
      aqara_sernsor.setError(err_msg)
    })
  },
})
