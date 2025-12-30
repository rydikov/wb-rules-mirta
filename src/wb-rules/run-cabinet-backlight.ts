import { PresenceSensors, RelayLights, AstroTimer } from '#wbm/global-devices'

let motionTimer: number | null = null

function resetMotionTimer() {
  if (motionTimer) {
    clearTimeout(motionTimer)
    motionTimer = null
  }
}

// Включаем свет в кабинете, если есть присутствие и нужна подстветка
// eslint-disable-next-line @typescript-eslint/no-confusing-void-expression, @typescript-eslint/no-unused-vars
const cabinetBacklightRule = defineRule('CABINET_BACKLIGHT', {
  whenChanged: PresenceSensors.Cabinet.presence_status_topic,
  then: function (newValue: WbRules.MqttValue | undefined) {
    const cabinetBacklightIsOn = RelayLights.Cabinet_01.value()

    // Если принудительно запустили правило, то newValue будет undefined, явно присваиваем ему статус датчика
    newValue ??= PresenceSensors.Cabinet.presence_status

    log.info('Motion detected, backlight is {}, value is {}'.format(String(cabinetBacklightIsOn), newValue))

    if (newValue && !cabinetBacklightIsOn) {
      log.info('Backlight in cabinet is on')
      RelayLights.Cabinet_01.on()
      resetMotionTimer()
    }
    else if (!newValue && cabinetBacklightIsOn) {
      resetMotionTimer() // TODO: Протестировать, нужен ли сброс таймера
      motionTimer = setTimeout(function () {
        RelayLights.Cabinet_01.off()
        log.info('Backlight in cabinet is off')
        motionTimer = null // Сбрасываем таймер
      }, 120000) as unknown as number// 2 минуты = 120000 миллисекунд
    }
  },
})

defineRule('CABINET_BACKLIGHT_CHECK_BACKLIGHT', {
  whenChanged: ['Backlights/cabinet', AstroTimer.is_day_topic],
  then: function (newValue, devName, cellName) {
    log.info('CABINET_BACKLIGHT_CHECK_BACKLIGHT -> devName:{}, cellName:{}, newValue:{}', devName, cellName, newValue)

    // Для виртуальных устройств значение запbсывается сразу
    const isDay = AstroTimer.isDay
    const cabinetBacklightIsEnable = Boolean(getControl('Backlights/cabinet')?.getValue())

    resetMotionTimer()

    if (cabinetBacklightIsEnable || !isDay) {
      log.debug('Enable')
      // enableRule(cabinetBacklightRule)
      // runRule(cabinetBacklightRule)
    }
    else {
      log.debug('Disable')
      // disableRule(cabinetBacklightRule)
    }
  },
})
