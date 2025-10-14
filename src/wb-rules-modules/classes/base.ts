// Базовый класс для устройств
export class DeviceBasedClass {

  device: WbRules.Device | undefined
  name: string

  constructor(
    name: string
  ) {
    this.device = getDevice(name)
    this.name = name
  }

}

// Базовый класс для устройств с равнозначными контролами, реле на несколько выходов и т.д.
// Для каждого контрола создается отдельный управляющий интервал
export class ControlBasedClass {

  control: WbRules.Control | undefined

  constructor(
    name: string
  ) {
    this.control = getControl(name)
  }

  value() {
    return this.control?.getValue()
  }

  set_value(value: string | number | boolean) {
    this.control?.setValue(value)
  }

}
