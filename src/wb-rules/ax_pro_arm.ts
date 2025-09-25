import { AxProAreas } from '@wbm/global_devices'
import { RelayLight } from '@wbm/wb_classes'

defineRule('ArmGroundFloor', {
  whenChanged: AxProAreas['GroundFloor'],
  then: function (newValue: number) {
    if (newValue === 1) {
      log.debug('Подвал поставлен на охрану')
      new RelayLight('Сabinet_01').off()
    }
  },
})
