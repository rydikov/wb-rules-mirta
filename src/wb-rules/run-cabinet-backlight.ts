import { PresenceSensors, RelayLights, AstroTimer } from '#wbm/global-devices'
import { RelayLight } from '#wbm/classes/wb'
import { MTDX62MB } from '#wbm/classes/mtdx62-mb'

function makeBacklightRule(
  ruleName: string,
  presenceDevice: MTDX62MB,
  backlightControl: string,
  backlightDevice: RelayLight,
  timeoutMs = 120000
) {
  let motionTimer: number | null = null

  function resetMotionTimer() {
    if (motionTimer) {
      clearTimeout(motionTimer)
      motionTimer = null
    }
  }

  defineRule(ruleName, {
    whenChanged: [
      presenceDevice.presence_status_topic,
      backlightControl,
      AstroTimer.is_day_topic,
    ],
    then: function (newValue, devName) {
      const isNight = !AstroTimer.isDay
      const isBacklightEnabled = Boolean(getControl(backlightControl)?.getValue())
      const isBacklightOn = Boolean(backlightDevice.value())

      // Проверяем, событие ли это движения
      const isMotionEvent = devName === presenceDevice.name

      log.info('Подсветка: движение={}, подстветка включена={}, ночь={}, состояние лампы={}',
        isMotionEvent, isBacklightEnabled, isNight, isBacklightOn)

      // Обработка изменения условий (ручное включение подсветки или день/ночь)
      if (!isMotionEvent) {
        resetMotionTimer()
        // Выключаем свет, если подстветка отключена или сейчас день
        if ((!isBacklightEnabled || !isNight) && isBacklightOn) {
          backlightDevice.off()
          log.info('Подсветка выключена')
        }
      }

      // Если подсветка отключена или сейчас день, ничего не делаем
      if (!isBacklightEnabled || !isNight) {
        return
      }

      // Явно определяем состояние датчика присутствия - newValue может быть от датчика, Backlights или AstroTimer
      const presenceStatus = isMotionEvent ? newValue : presenceDevice.presence_status

      if (presenceStatus) {
        log.info('Подсветка включена (обнаружено движение)')
        backlightDevice.on()
        resetMotionTimer()
      }
      else {
        resetMotionTimer()
        motionTimer = setTimeout(function () {
          backlightDevice.off()
          log.info('Подсветка выключена (таймаут движения)')
          motionTimer = null
        }, timeoutMs) as unknown as number
      }
    },
  })
}

makeBacklightRule(
  'CABINET_BACKLIGHT',
  PresenceSensors.Cabinet,
  'Backlights/cabinet',
  RelayLights.Cabinet_01
)
