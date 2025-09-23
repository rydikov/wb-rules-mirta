var suncalc = require('suncalc')

defineRule('OUT_LIGHTS_SWITCH', {
  when: cron('@every 180s'),
  then: function () {

    var lat = 53.11
    var lng = 45.05

    var now = new Date()
    var times = suncalc.SunCalc.getTimes(now, lat, lng)
    var sunrise = times.sunrise
    var sunset = times.sunset

    var off_date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)

    if ((now > sunset) && (now < off_date)) {

      // Sunset
      log.debug('Дата: {}', now)
      log.debug('Восход: {}', sunrise)
      log.debug('Закат: {}', sunset)

    }
    else {

      if ((now > sunrise) && (now < sunset)) {

        // Sunrise
        log.debug('Дата: {}', now)
        log.debug('Восход: {}', sunrise)
        log.debug('Закат: {}', sunset)

      }

    }

  },
})
