import { Light } from '@wbm/global_devices'

defineRule('ArmGroundFloor', {
  whenChanged: 'AxPro/state_01',
  then: function (newValue) {

    if (newValue == 1) {

      log.info('Подвал поставлен на охрану')
      new Light('Сabinet_01').off()

    }

  },
})
