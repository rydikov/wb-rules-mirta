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

    // Detect if this is a motion event
    const isMotionEvent = devName === PresenceSensors.Cabinet.name

    log.info('Cabinet backlight: motion={}, enabled={}, night={}, state={}',
      isMotionEvent, isBacklightEnabled, isNight, isBacklightOn)

    // Handle condition changes (manual toggle or day/night)
    if (!isMotionEvent) {
      resetMotionTimer()

      // Turn off light if conditions are no longer met
      if ((!isBacklightEnabled || !isNight) && isBacklightOn) {
        RelayLights.Cabinet_01.off()
        log.info('Cabinet backlight turned off (conditions not met)')
      }
    }

    // Only control light if conditions are met
    if (!isBacklightEnabled || !isNight) {
      return
    }

    // Handle motion event - newValue could be from motion, Backlights, or AstroTimer
    const presenceStatus = isMotionEvent ? newValue : PresenceSensors.Cabinet.presence_status

    if (presenceStatus) {
      log.info('Cabinet backlight turned on (motion detected)')
      RelayLights.Cabinet_01.on()
      resetMotionTimer()
    }
    else {
      resetMotionTimer()
      motionTimer = setTimeout(function () {
        RelayLights.Cabinet_01.off()
        log.info('Cabinet backlight turned off (motion timeout)')
        motionTimer = null
      }, 120000) as unknown as number // 2 minutes
    }
  },
})
