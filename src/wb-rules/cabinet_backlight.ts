import { PresenceSensors, DimmableLights, AstroTimer } from '#wbm/global_devices'

defineRule('CABINET_BACKLIGHT', {
  whenChanged: [PresenceSensors.Сabinet_01.presence_status_topic],
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
