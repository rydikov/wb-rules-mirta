import { AstroTimer } from '#wbm/global-devices'
import { RelayLight } from '#wbm/classes/wb'
import { MTDX62MB } from '#wbm/classes/mtdx62-mb'

export function makeBacklightRule(
  ruleName: string,
  presenceDevice: MTDX62MB,
  backlightControl: string,
  backlightDevice: RelayLight,
  timeoutMs = 120000,
  doorSensorTopic?: string
) {
  let motionTimer: number | null = null

  function resetMotionTimer() {
    if (motionTimer) {
      clearTimeout(motionTimer)
      motionTimer = null
    }
  }

  // Формируем массив топиков для отслеживания изменений динамически, т.к. геркона может не быть
  const whenChanged = [
    presenceDevice.presenceStatusTopic,
    backlightControl,
    AstroTimer.isDayTopic,
  ]
  if (doorSensorTopic) {
    whenChanged.push(doorSensorTopic)
  }

  defineRule(ruleName, {
    whenChanged,
    then: function (newValue, devName) {
      const isNight = !AstroTimer.isDay
      const isBacklightEnabled = Boolean(getControl(backlightControl)?.getValue())
      const isBacklightOn = Boolean(backlightDevice.value())

      // Проверяем, событие ли это движения
      const isMotionEvent = devName === presenceDevice.name
      // Проверяем, событие ли это от геркона
      const isDoorEvent = doorSensorTopic && devName === doorSensorTopic

      log.debug('Подсветка: движение={}, дверь={}, подсветка включена={}, ночь={}, состояние освещения={}',
        isMotionEvent, isDoorEvent, isBacklightEnabled, isNight, isBacklightOn)
      log.debug('Новое значение: {} от устройства: {}', newValue, devName)

      // Обработка изменения условий (ручное включение подсветки или день/ночь)
      if (!isMotionEvent && !isDoorEvent) {
        resetMotionTimer()
        // Выключаем свет, если подсветка отключена или сейчас день
        if ((!isBacklightEnabled || !isNight) && isBacklightOn) {
          backlightDevice.off()
          log.debug('Подсветка выключена')
        }
      }

      // Если подсветка отключена или сейчас день, ничего не делаем
      if (!isBacklightEnabled || !isNight) {
        return
      }

      // Явно определяем состояние датчика присутствия - newValue может быть от датчика, Backlights или AstroTimer
      const presenceStatus = isMotionEvent ? newValue : presenceDevice.presenceStatus

      if (presenceStatus || isDoorEvent) {
        log.debug('Подсветка включена (обнаружено движение или открытие двери)')
        backlightDevice.on()
        resetMotionTimer()
      }
      else {
        resetMotionTimer()
        motionTimer = setTimeout(function () {
          backlightDevice.off()
          log.debug('Подсветка выключена (таймаут движения)')
          motionTimer = null
        }, timeoutMs) as unknown as number
      }
    },
  })
}
