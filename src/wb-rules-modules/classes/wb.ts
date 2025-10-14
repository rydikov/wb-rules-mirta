import { ControlBasedClass } from '#wbm/classes/base'

// Свет включающийся через реле
export class RelayLight extends ControlBasedClass {

  isOn(): boolean {
    return Boolean(this.control?.getValue())
  }

  on() {
    this.setValue(true)
  }

  off() {
    this.setValue(false)
  }

}

// Диммируемые лампы на основе модуля WB-MDM3
export class DimmableLight extends RelayLight {

  setBrightness(percent: number) {
    // device/K1 => device/channel1
    const brightness_control_name = this.name.replace('/K', '/channel')
    const brightness_control = getControl(brightness_control_name)
    brightness_control?.setValue(percent)
  }

}

export class LedLight extends ControlBasedClass {

}
