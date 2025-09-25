import { AxProAreas, axProStatesEnum } from '@wbm/global_devices'
import { RelayLight } from '@wbm/wb_classes'

defineRule('ArmGroundFloor', {
  whenChanged: AxProAreas['GroundFloor'],
  then: function (newValue: axProStatesEnum) {
    if (newValue === axProStatesEnum.Armed) {
      log.debug('Подвал поставлен на охрану')
      new RelayLight('Сabinet_01').off()
    }
  },
})
