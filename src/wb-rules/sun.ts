// Астрологический таймер

import { SunCalc } from '#wbm/suncalc'
import { formatTimestampES5 } from '#wbm/helpers'

defineVirtualDevice('AstroTimer', {
  title: 'Астрономический таймер',
  cells: {
    now: {
      title: 'Время актуализации',
      type: 'text',
      value: '',
    },
    sunrise: {
      title: 'Восход',
      type: 'text',
      value: '',
    },
    sunset: {
      title: 'Закат',
      type: 'text',
      value: '',
    },
    is_day: {
      title: 'День',
      type: 'switch',
      readonly: true,
      value: true,
    },
  },
})

// Updating a virtual device
defineRule('OUT_LIGHTS_SWITCH', {
  when: cron('@every 60s'),
  then: function () {
    // Home location
    const lat = 53.11
    const lng = 45.05

    const now = new Date()
    const times = SunCalc.getTimes(now, lat, lng)
    const sunrise = times.sunrise
    const sunset = times.sunset

    const is_day = (now >= sunrise && now < sunset)

    // const off_date: Date = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59)

    // let is_day = false

    // if ((now > sunset) && (now < off_date)) {
    //   // Sunset
    //   is_day = false
    // }
    // else {
    //   if ((now > sunrise) && (now < sunset)) {
    //     // Sunrise
    //     is_day = true
    //   }
    // }

    const device = getDevice('AstroTimer')

    if (device !== undefined) {
      device.getControl('now').setValue(formatTimestampES5(now.getTime()))
      device.getControl('sunrise').setValue(formatTimestampES5(sunrise.getTime()))
      device.getControl('sunset').setValue(formatTimestampES5(sunset.getTime()))
      device.getControl('is_day').setValue(is_day)
    }
  },
})
