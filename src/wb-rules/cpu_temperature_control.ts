defineRule('CPU_TEMPERATURE_CONTROL', {
  whenChanged: 'hwmon/CPU Temperature',

  then: function (newValue: number) {

    if (newValue > 55) {

      log.debug('CPU Temperature: {}', newValue)

    }

  },
})
