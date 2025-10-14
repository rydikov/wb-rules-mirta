// Класс для датчика присутствия mtdx62-mb
export class MTDX62MB {

  device: WbRules.Device | undefined
  name: string

  constructor(
    name: string
  ) {
    this.device = getDevice(name)
    this.name = name
  }

  get presence_status_topic(): string {
    return '{}/presence_status'.format(this.name)
  }

  get presence_status(): boolean {
    return Boolean(this.device?.getControl('presence_status').getValue())
  }

  get illuminance_topic(): string {
    return '{}/illuminance'.format(this.name)
  }

  get illuminance(): number {
    return Number(this.device?.getControl('illuminance').getValue())
  }

  get target_distance_topic(): string {
    return '{}/target_distance'.format(this.name)
  }

  get target_distance(): number {
    return Number(this.device?.getControl('target_distance').getValue())
  }

}
