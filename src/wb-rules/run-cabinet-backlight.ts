import { PresenceSensors, RelayLights, AstroTimer } from '#wbm/global-devices'

let motionTimer: number | null = null

function resetMotionTimer() {
  if (motionTimer) {
    clearTimeout(motionTimer)
    motionTimer = null
  }
}

// Включаем свет в кабинете, если есть присутствие и нужна подстветка
defineRule('CABINET_BACKLIGHT', {
  whenChanged: PresenceSensors.Cabinet.presence_status_topic,
  then: function (newValue) {
    const CabinetBacklightIsEnable = Boolean(getControl('Backlights/cabinet')?.getValue())
    log.info('Motion detected')

    if (newValue && !AstroTimer.isDay && CabinetBacklightIsEnable) {
      log.info('Backlight in cabinet is on')
      RelayLights.Cabinet_01.on()
      resetMotionTimer()
    }
    else if (!newValue && CabinetBacklightIsEnable) {
      resetMotionTimer()
      motionTimer = setTimeout(function () {
        RelayLights.Cabinet_01.off()
        log.info('Backlight in cabinet is off')
        motionTimer = null // Сбрасываем таймер
      }, 120000) as unknown as number// 2 минуты = 120000 миллисекунд
    }
  },
})

defineRule('CABINET_BACKLIGHT_CHECK_BACKLIGHT', {
  whenChanged: ['Backlights/cabinet'],
  then: function (newValue) {
    resetMotionTimer()
    if (newValue && !AstroTimer.isDay && PresenceSensors.Cabinet.presence_status) {
      RelayLights.Cabinet_01.on()
    }
    else {
      RelayLights.Cabinet_01.off()
    }
  },
})
