defineRule('MASTER_CONTROL', {
  whenChanged: 'wb-mcm8_138/Input 7',
  then: function (newValue) {

    if (newValue) {

      log.debug('Весь свет выключен')
      dev['wb-mrm2-mini_40/K1'] = false
      dev['wb-mrm2-mini_40/K2'] = false

    }

  },
})
