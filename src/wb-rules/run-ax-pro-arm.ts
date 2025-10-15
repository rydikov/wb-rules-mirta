import { AxProAreas, axProStatesEnum, RelayLights } from '#wbm/global-devices'

defineRule('ArmGroundFloor', {
  whenChanged: AxProAreas['GroundFloor'],
  then: function (newValue: axProStatesEnum) {
    if (newValue === axProStatesEnum.Armed) {
      log.debug('Подвал поставлен на охрану')
      RelayLights.Cabinet_01.off()
    }
  },
})
