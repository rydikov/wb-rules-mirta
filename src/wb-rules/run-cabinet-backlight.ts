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
  whenChanged: [PresenceSensors.Cabinet.presence_status_topic],
  then: function (newValue) {
    const CabinetBacklightStatus = Boolean(getControl('Backlights/cabinet')?.getValue())

    log.info('PresenceSensors get new value: {}', newValue)
    log.info('CabinetBacklightStatus: {}', CabinetBacklightStatus)

    if (newValue && !AstroTimer.isDay && CabinetBacklightStatus && !RelayLights.Cabinet_01.isOn()) {
      log.info('Backlight is on')
      RelayLights.Cabinet_01.on()
      resetMotionTimer()
    }
    else if (!newValue && RelayLights.Cabinet_01.isOn()) {
      resetMotionTimer()
      motionTimer = setTimeout(function () {
        RelayLights.Cabinet_01.off()
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
