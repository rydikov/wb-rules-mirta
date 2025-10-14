// Класс Астрономического таймера
export class AstroTimerCls {

  device: WbRules.Device | undefined
  name: string

  constructor(
    name: string
  ) {
    this.device = getDevice(name)
    this.name = name
  }

  get is_day_topic(): string {
    return '{}/is_day'.format(this.name)
  }

  get is_day(): boolean {
    return Boolean(this.device?.getControl('is_day').getValue())
  }

  get backlight_topic(): string {
    return '{}/backlight'.format(this.name)
  }

  get backlight(): boolean {
    return Boolean(this.device?.getControl('backlight').getValue())
  }

}
