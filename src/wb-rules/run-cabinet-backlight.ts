import { PresenceSensors, DimmableLights, AstroTimer } from '#wbm/global-devices'

defineRule('CABINET_BACKLIGHT', {
  whenChanged: [PresenceSensors.Cabinet_01.presence_status_topic],
  then: function (newValue) {
    if (newValue && AstroTimer.doesNeedToTurnOnBacklight() && !DimmableLights.Cabinet.isOn()) {
      DimmableLights.Cabinet.setBrightness(20)
      DimmableLights.Cabinet.on()
    }
    else if (!newValue && DimmableLights.Cabinet.isOn()) {
      DimmableLights.Cabinet.off()
    }
  },
})
