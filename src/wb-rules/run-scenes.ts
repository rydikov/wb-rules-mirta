function publishRpcMessage(topic: string, msg: string): void {
  publish(
    topic,
    JSON.stringify({
      params: {
        protocol: 'modbus-tcp',
        ip: '192.168.1.81',
        port: 502,
        slave_id: 255,
        function: 23,
        address: 32001,
        count: 4,
        write_address: 42001,
        write_count: 2,
        format: 'HEX',
        msg: msg,
        response_size: 12,
        total_timeout: 10000,
      },
    })
  )
}

function parseColorTemperatureFromResponse(response: string): number | null {
  // Expected payload example: 010101010a8e0000
  // Lamp CT is stored in bytes 5-6 => hex chars [8..12): 0a8e
  if (!response || response.length < 12) {
    return null
  }

  const ctHex = response.slice(8, 12)
  const ctValue = parseInt(ctHex, 16)

  if (isNaN(ctValue)) {
    return null
  }

  return ctValue
}

function extractResponseFromMqttMessage(messageValue: string): string | null {
  try {
    const payload = JSON.parse(messageValue) as { result?: { response?: string } }
    const response = payload.result?.response ? payload.result.response : ''
    return response || null
  }
  catch (e) {
    log.warning('Cannot parse MQTT reply JSON: {}'.format(String(e)))
    return null
  }
}

function isResponseError(response: string): boolean {
  return response.toLowerCase() === '0101010700000002'
}

function parseWordFromResponse(response: string): number | null {
  if (!response || response.length < 12) {
    return null
  }

  const wordHex = response.slice(8, 12)
  const wordValue = parseInt(wordHex, 16)

  if (isNaN(wordValue)) {
    return null
  }

  return wordValue
}

defineVirtualDevice('scenes', {
  title: 'Сценарии',
  cells: {
    'relax_evening': { type: 'pushbutton' },
    'movie_night': { type: 'pushbutton' },
    'morning_routine': { type: 'pushbutton' },
  },
})

defineRule('Scene_Control', {
  whenChanged: ['scenes/relax_evening', 'scenes/movie_night', 'scenes/morning_routine'],
  then: function (newValue, devName, cellName) {
    log.debug(newValue)
    log.debug(devName)
    log.debug(cellName)

    if (cellName == 'relax_evening') {
      // log.debug('Сцена Расслабляющий вечер активирована')
      log.info('get-ct')
      publishRpcMessage('/rpc/v1/wb-mqtt-serial/port/Load/get-ct', '01010104')
    }
    if (cellName == 'movie_night') {
      // log.debug('Сцена Киновечер активирована')
      log.info('get-brightness')
      publishRpcMessage('/rpc/v1/wb-mqtt-serial/port/Load/get-brightness', '01010101')
    }
    if (cellName == 'morning_routine') {
      // log.debug('Сцена Утро активирована')
      log.info('get-status')
      publishRpcMessage('/rpc/v1/wb-mqtt-serial/port/Load/get-status', '01010102')
    }
  },
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/get-ct/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay topic value: {}'.format(message.value))

  const response = extractResponseFromMqttMessage(message.value)
  if (response === null) {
    return
  }

  if (isResponseError(response)) {
    log.warning('DLC error response for color temperature request: {}'.format(response))
    return
  }

  const ct = parseColorTemperatureFromResponse(response)
  if (ct === null) {
    log.warning('Cannot parse color temperature from response: {}'.format(response))
    return
  }

  log.info('Color temperature: {}'.format(ct))
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/get-brightness/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay topic value: {}'.format(message.value))

  const response = extractResponseFromMqttMessage(message.value)
  if (response === null) {
    return
  }

  if (isResponseError(response)) {
    log.warning('DLC error response for brightness request: {}'.format(response))
    return
  }

  const brightness = parseWordFromResponse(response)
  if (brightness === null) {
    log.warning('Cannot parse brightness from response: {}'.format(response))
    return
  }

  log.info('Brightness: {}'.format(brightness))
})

trackMqtt('/rpc/v1/wb-mqtt-serial/port/Load/get-status/reply', (message: { topic: string, value: string }) => {
  log.info('MQTT replay topic value: {}'.format(message.value))

  const response = extractResponseFromMqttMessage(message.value)
  if (response === null) {
    return
  }

  if (isResponseError(response)) {
    log.warning('DLC error response for status request: {}'.format(response))
    return
  }

  const statusValue = parseWordFromResponse(response)
  if (statusValue === null) {
    log.warning('Cannot parse status from response: {}'.format(response))
    return
  }

  log.info('Power status: {}'.format(statusValue > 0 ? 'ON' : 'OFF'))
})
