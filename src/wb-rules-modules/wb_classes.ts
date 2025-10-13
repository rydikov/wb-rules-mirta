class BaseDevice {

  control: WbRules.Control | undefined

  constructor(
    name: string
  ) {
    this.control = getControl(name)
  }

  value() {
    return this.control?.getValue()
  }

}

// Свет включающийся через реле
export class RelayLight extends BaseDevice {

  set_value(value: string | number | boolean) {
    this.control?.setValue(value)
  }

  on() {
    this.set_value(true)
  }

  off() {
    this.set_value(false)
  }

}
