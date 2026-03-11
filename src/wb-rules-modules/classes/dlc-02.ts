import { toHex, toBinary, binaryToHex } from '#wbm/helpers'

/**
* Принцип формирования адреса устройства
* | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
* | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
* | 0    | 0    | Short address 0–63                      |
*
* И группы
* | Bit7 | Bit6 | Bit5 | Bit4 | Bit3 | Bit2 | Bit1 | Bit0 |
* | ---- | ---- | ---- | ---- | ---- | ---- | ---- | ---- |
* | 1    | 0    | 0    | 0    | Group address 0–15        |
*
**/
export function getGroupAddress(address: number): string {
  return binaryToHex('1000' + toBinary(address, 4), 2)
}

export function getDeviceAddress(address: number): string {
  return binaryToHex('00' + toBinary(address, 6), 2)
}

// Класс для управление Dali контроллером DLC02
export class DLC02 {

  ip: string
  port: number
  slaveId: number

  constructor(
    ip: string,
    port = 502,
    slaveID = 255
  ) {
    this.ip = ip
    this.port = port
    this.slaveId = slaveID
  }

  publishRpcMessage(
    client: string,
    msg: string,
    fnc: number,
    address: number,
    count: number,
    write_address: number | null,
    write_count: number | null

  ): void {
    const topic = '/rpc/v1/wb-mqtt-serial/port/Load/' + client
    const params: Record<string, number | string> = {
      protocol: 'modbus-tcp',
      ip: this.ip,
      port: this.port,
      slave_id: this.slaveId,
      function: fnc,
      address: address,
      count: count,
      format: 'HEX',
      msg: msg,
      response_size: 12,
      total_timeout: 10000,
    }

    if (write_address !== null) {
      params.write_address = write_address
    }

    if (write_count !== null) {
      params.write_count = write_count
    }

    // Publish to Mqtt
    publish(topic, JSON.stringify({ params: params }))
  }

  /**
   * Запускает сцену через записью 8-байтной команды в holding-регистры,
   * начиная с 41001, через Modbus function 16 (Write Multiple Registers).
   *
   * Формат payload:
   * - `bus`      : 1 байт, номер DALI-шины в hex (`01` или `02`)
   * - `address`  : 1 байт, адрес назначения в hex. No address broadcast: 253(0xFD) roadcast with address: 255(0xFF)
   * - `03`       : DALI-команда Recall Scene
   * - `scene`    : 1 байт, номер сцены в hex (`00`..`0F`)
   * - `00000000` : заполнение до 8 байт / 4 регистров
   *
   * Итого в регистр 41001 записывается сообщение вида:
   * `bus + address + 03 + scene + 00000000`
   *
   * Примеры на шине А:
   * - `runScene('01', 0, '18')` -> устройство 12, сцена 0
   * - `runScene('01', 0)` -> сцена 0
   * - `runScene('01', 0, '80')` -> группа 0, сцена 0
   * - `runScene('01', 10, '82')` -> группа 1, сцена 10
   *
   * Номер сцены передается от 0 до 15, в hex переводится автоматически
   **/
  runScene(bus: string, scene: number, address = 'FF'): void {
    const msg = bus + address + '03' + toHex(scene) + '00000000'
    this.publishRpcMessage('scene-runner', msg, 16, 41001, 4, null, null)
  }

  sendBrightnessRequest(bus: string, address: string): void {
    const msg = '01' + bus + address + '01'
    this.publishRpcMessage('brightness-request', msg, 23, 32001, 4, 42001, 2)
  }

  sendStatusRequest(bus: string, address: string): void {
    const msg = '01' + bus + address + '02'
    this.publishRpcMessage('status-request', msg, 23, 32001, 4, 42001, 2)
  }

  sendColorTemperatureRequest(bus: string, address: string): void {
    const msg = '01' + bus + address + '04'
    this.publishRpcMessage('ct-request', msg, 23, 32001, 4, 42001, 2)
  }

}
