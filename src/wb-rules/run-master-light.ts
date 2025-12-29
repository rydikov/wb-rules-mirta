// import { useMasterControl } from '#wbm/master-control'
// import { WallSwitches, RelayLights } from '#wbm/global-devices'

// useMasterControl({
//   ruleName: 'CABINET_MASTER_CONTROL',
//   control: WallSwitches['Room1_1'],
//   loads: [
//     RelayLights.Room1_1,
//     RelayLights.Room1_2,
//     RelayLights.Room1_3,
//     RelayLights.Room1_4,
//     RelayLights.Room1_5,
//   ],
// })

import { RelayLights } from '#wbm/global-devices'

defineRule('CHECK_AQARA_SENSORS', {
  when: cron('@hourly'),
  then: function () {
    log.info('Backlight in cabinet is on (cron)')
    RelayLights.Cabinet_01.on()
    setTimeout(function () {
      RelayLights.Cabinet_01.off()
      log.info('Backlight in cabinet is off (cron)')
    }, 120000) as unknown as number// 2 минуты = 120000 миллисекунд
  },
})
