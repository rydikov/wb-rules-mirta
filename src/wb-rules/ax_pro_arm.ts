import { LIGHTS } from '@wbm/global_devices'

defineRule('ArmGroundFloor', {
  whenChanged: 'AxPro/state_01',
  then: function (newValue) {

    if (newValue == 1) {

      log.info('Подвал поставлен на охрану')
      LIGHTS.OUT.Off('Сabinet_01', false)

    }

  },
})
