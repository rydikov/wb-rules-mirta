// Класс для датчика температуры и влажности Aqara
export class AqaraSensor {

  device: WbRules.Device | undefined
  name: string

  constructor(
    name: string
  ) {
    this.device = getDevice(name)
    this.name = name
  }

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
