import { ControlBasedClass } from '#wbm/classes/base'

// Свет включающийся через реле
export class RelayLight extends ControlBasedClass {

  on() {
    this.set_value(true)
  }

  off() {
    this.set_value(false)
  }

}
