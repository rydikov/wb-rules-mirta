import { PresenceSensors, RelayLights, AstroTimer } from '#wbm/global-devices'

let motionTimer: number | null = null

function resetMotionTimer() {
  if (motionTimer) {
    clearTimeout(motionTimer)
    motionTimer = null
  }
}

defineRule('CABINET_BACKLIGHT', {
  whenChanged: [
    PresenceSensors.Cabinet.presence_status_topic,
    'Backlights/cabinet',
    AstroTimer.is_day_topic,
  ],
  then: function (newValue, devName) {
    const isNight = !AstroTimer.isDay
    const isBacklightEnabled = Boolean(getControl('Backlights/cabinet')?.getValue())
    const isBacklightOn = Boolean(RelayLights.Cabinet_01.value())

    // Проверяем, событие ли это движения
    const isMotionEvent = devName === PresenceSensors.Cabinet.name

    log.info('Подсветка кабинета: движение={}, подстветка включена={}, ночь={}, состояние лампы={}',
      isMotionEvent, isBacklightEnabled, isNight, isBacklightOn)

    // Обработка изменения условий (ручное включение подсветки или день/ночь)
    if (!isMotionEvent) {
      resetMotionTimer()
      // Выключаем свет, если подстветка отключена или сейчас день
      if ((!isBacklightEnabled || !isNight) && isBacklightOn) {
        RelayLights.Cabinet_01.off()
        log.info('Подсветка кабинета выключена')
      }
    }

    // Если подсветка отключена или сейчас день, ничего не делаем
    if (!isBacklightEnabled || !isNight) {
      return
    }

    // Явно определяем состояние датчика присутствия - newValue может быть от датчика, Backlights или AstroTimer
    const presenceStatus = isMotionEvent ? newValue : PresenceSensors.Cabinet.presence_status

    if (presenceStatus) {
      log.info('Подсветка кабинета включена (обнаружено движение)')
      RelayLights.Cabinet_01.on()
      resetMotionTimer()
    }
    else {
      resetMotionTimer()
      motionTimer = setTimeout(function () {
        RelayLights.Cabinet_01.off()
        log.info('Подсветка кабинета выключена (таймаут движения)')
        motionTimer = null
      }, 120000) as unknown as number // 2 минуты
    }
  },
})
