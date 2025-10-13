import { AxProAreas, axProStatesEnum, RelayLights } from '@wbm/global_devices'

defineRule('ArmGroundFloor', {
  whenChanged: AxProAreas['GroundFloor'],
  then: function (newValue: axProStatesEnum) {
    if (newValue === axProStatesEnum.Armed) {
      log.debug('Подвал поставлен на охрану')
      RelayLights.Сabinet_01.off()
    }
  },
})
