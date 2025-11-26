import { PresenceSensors, RelayLights, AstroTimer } from '#wbm/global-devices'

let motionTimer: NodeJS.Timeout | null = null

// Включаем свет в кабинете, если есть присутствие и нужна подстветка
defineRule('CABINET_BACKLIGHT', {
  whenChanged: [PresenceSensors.Cabinet.presence_status_topic],
  then: function (newValue) {
    if (newValue && AstroTimer.doesNeedToTurnOnBacklight() && !RelayLights.Cabinet_01.isOn()) {
      RelayLights.Cabinet_01.on()
      if (motionTimer) {
        clearTimeout(motionTimer) // Сбрасываем существующий таймер
        motionTimer = null
      }
    }
    else if (!newValue && RelayLights.Cabinet_01.isOn()) {
      if (motionTimer) {
        clearTimeout(motionTimer) // Сбрасываем предыдущий таймер
      }
      motionTimer = setTimeout(function () {
        RelayLights.Cabinet_01.off()
        motionTimer = null // Сбрасываем таймер
      }, 120000) // 2 минуты = 120000 миллисекунд
    }
  },
})
