import { AxProAreas, axProStatesEnum, RelayLights } from '#wbm/global-devices'

// Отключаем свет в кабинете, когда подвал встает на охрану
defineRule('ArmGroundFloor', {
  whenChanged: AxProAreas.GroundFloor.name,
  then: function (newValue: axProStatesEnum) {
    if (newValue === axProStatesEnum.Armed) {
      log.debug('Подвал поставлен на охрану')
      RelayLights.Cabinet_01.off()
    }
  },
})
