import { SunCalc } from '#wbm/suncalc'

defineRule('OUT_LIGHTS_SWITCH', {
  when: cron('@every 180s'),
  then: function () {
    const lat = 53.11
    const lng = 45.05

    const now = new Date()
    const times = SunCalc.getTimes(now, lat, lng)
    const sunrise = times.sunrise
    const sunset = times.sunset

    const off_date: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)

    if ((now > sunset) && (now < off_date)) {
      // Sunset
      log.debug('Дата: {}', now.toString())
      log.debug('Восход: {}', sunrise.toString())
      log.debug('Закат: {}', sunset.toString())
    }
    else {
      if ((now > sunrise) && (now < sunset)) {
        // Sunrise
        log.debug('Дата: {}', now.toString())
        log.debug('Восход: {}', sunrise.toString())
        log.debug('Закат: {}', sunset.toString())
      }
    }
  },
})
