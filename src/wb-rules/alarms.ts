const tgConf = readConfig('/mnt/data/supervisor/wb-rules-conf/tg.conf') as {
  token: string
  chatId: string
}

const recipients: WbRules.Alarms.TelegramRecipient = {
  'type': 'telegram',
  'token': tgConf.token,
  'chatId': tgConf.chatId,
}

const zigbeeAlarms: WbRules.Alarms.Config = {
  'deviceName': 'Zigbee Alarms',
  'deviceTitle': 'Zigbee Alarms',

  'recipients': [recipients],

  'alarms': [
  // TODO: build dynamically
    {
      'name': 'AqaraTS01IsOffline',
      'cell': 'AqaraTS01/linkquality',
      'minValue': 10,
      // 'alarmMessage': 'AqaraTS01 is offline',
      // 'noAlarmMessage': 'AqaraTS01 is back on',
    },

  ],
}

Alarms.load(zigbeeAlarms)

const axProAlarms: WbRules.Alarms.Config = {
  'deviceName': 'Ax Pro Alarms',
  'deviceTitle': 'Ax Pro Alarms',

  'recipients': [recipients],

  'alarms': [
  // TODO: build dynamically
    {
      'name': 'ax-pro-1',
      'cell': 'ax-pro-1/status',
      'expectedValue': 'online',
    },
    {
      'name': 'ax-pro-2',
      'cell': 'ax-pro-2/status',
      'expectedValue': 'online',
    },
    {
      'name': 'ax-pro-3',
      'cell': 'ax-pro-3/status',
      'expectedValue': 'online',
    },
    {
      'name': 'ax-pro-4',
      'cell': 'ax-pro-4/status',
      'expectedValue': 'online',
    },

  ],
}

Alarms.load(axProAlarms)
