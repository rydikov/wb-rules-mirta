const tgConf = readConfig('/mnt/data/supervisor/wb-rules-conf/tg.conf') as {
  token: string
  chatId: string
}

const alarms: WbRules.Alarms.Config = {
  'deviceName': 'Zigbee Alarms',
  'deviceTitle': 'Zigbee Alarms',

  'recipients': [
    {
      'type': 'telegram',
      'token': tgConf.token,
      'chatId': tgConf.chatId,
    },
  ],

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

Alarms.load(alarms)
