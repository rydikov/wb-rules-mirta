import { RelayLights } from '@wbm/global_devices'

class BaseDevice {

  loaded_dev: WbRules.Control | undefined
  list: Record<string, string>
  control: string

  constructor(
    name: string,
    list: Record<string, string>
  ) {
    this.list = list
    this.control = this.list[name]
    this.loaded_dev = getControl(this.control)
  }

  value() {
    return this.loaded_dev?.getValue()
  }

}

// Свет включающийся через реле
export class RelayLight extends BaseDevice {

  constructor(
    name: string
  ) {
    super(name, RelayLights)
  }

  set_value(value: string | number | boolean) {
    this.loaded_dev?.setValue(value)
  }

  on() {
    this.set_value(true)
  }

  off() {
    this.set_value(false)
  }

}
