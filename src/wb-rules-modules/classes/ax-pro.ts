import { DeviceBasedClass } from '#wbm/classes/base'

// Класс для датчика температуры и влажности Aqara
export class AxProSensor extends DeviceBasedClass {

  title: string
  has_humidity: boolean

  constructor(
    name: string,
    title: string,
    has_humidity = false
  ) {
    super(name)
    this.title = title
    this.has_humidity = has_humidity
  }

  get last_seen_timestamp(): number {
    return Number(this.device?.getControl('last_seen_timestamp').getValue())
  }

  get status(): string {
    return String(this.device?.getControl('last_seen_timestamp').getValue())
  }

  get humidity_topic(): string {
    return '{}/humidity'.format(this.name)
  }

  get humidity(): number {
    if (this.has_humidity) {
      return Number(this.device?.getControl('humidity').getValue())
    }
    else {
      return 0
    }
  }

  get temperature_topic(): string {
    return '{}/temperature'.format(this.name)
  }

  get temperature(): number {
    return Number(this.device?.getControl('temperature').getValue())
  }

  setIsUpated(is_updated: boolean) {
    this.device?.getControl('is_updated').setValue(is_updated)
  }

  setError(err_msg: string) {
    this.device?.controlsList().forEach(function (ctrl) {
      ctrl.setError(err_msg)
    })
  }

}
