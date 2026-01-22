import { ControlBasedClass } from '#wbm/classes/base'

// Свет включающийся через реле
export class RelayLight extends ControlBasedClass {

  isOn(): boolean {
    log.debug('Control {} is on'.format(this.name))
    return Boolean(this.control?.getValue())
  }

  on() {
    this.setValue(true)
    log.debug('Control {} is on'.format(this.name))
  }

  off() {
    this.setValue(false)
    log.debug('Control {} is off'.format(this.name))
  }

}

// Диммируемые лампы на основе модуля WB-MDM3
export class DimmableLight extends RelayLight {

  setBrightness(percent: number) {
    // device/K1 => device/channel1
    const brightnessControlName = this.name.replace('/K', '/channel')
    const brightnessControl = getControl(brightnessControlName)
    brightnessControl?.setValue(percent)
  }

}

export class LedLight extends ControlBasedClass {

}
