import { DeviceBasedClass } from '#wbm/classes/base'

// Класс Астрономического таймера
export class AstroTimerCls extends DeviceBasedClass {

  get is_day_topic(): string {
    return '{}/is_day'.format(this.name)
  }

  get isDay(): boolean {
    return Boolean(this.device?.getControl('is_day').getValue())
  }

  get backlight_topic(): string {
    return '{}/backlight'.format(this.name)
  }

  get backlight(): boolean {
    return Boolean(this.device?.getControl('backlight').getValue())
  }

  doesNeedToTurnOnBacklight(): boolean {
    return this.backlight && !this.isDay
  }

}
