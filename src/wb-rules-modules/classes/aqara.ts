import { DeviceBasedClass } from '#wbm/classes/base'

// Класс для датчика температуры и влажности Aqara
export class AqaraSensor extends DeviceBasedClass {

  get last_seen_topic(): string {
    return '{}/last_seen'.format(this.name)
  }

  get last_seen(): number {
    return Number(this.device?.getControl('last_seen').getValue())
  }

  get humidity_topic(): string {
    return '{}/humidity'.format(this.name)
  }

  get humidity(): number {
    return Number(this.device?.getControl('humidity').getValue())
  }

  get temperature_topic(): string {
    return '{}/temperature'.format(this.name)
  }

  get temperature(): number {
    return Number(this.device?.getControl('temperature').getValue())
  }

  setError(err_msg: string) {
    this.device?.controlsList().forEach(function (ctrl) {
      ctrl.setError(err_msg)
    })
  }

}
