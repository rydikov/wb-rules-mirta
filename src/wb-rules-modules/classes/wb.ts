import { ControlBasedClass } from '#wbm/classes/base'

// Свет включающийся через реле
export class RelayLight extends ControlBasedClass {

  on() {
    this.setValue(true)
  }

  off() {
    this.setValue(false)
  }

}
