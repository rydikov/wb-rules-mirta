const tgConf = readConfig('/mnt/data/supervisor/wb-rules-conf/tg.conf') as {
  token: string
  chatId: string
}

const alarms = {
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
      'cell': 'AqaraTS01/last_seen#error',
      'expectedValue': '',
      'alarmMessage': 'AqaraTS01 is offline',
      'noAlarmMessage': 'AqaraTS01 is back on',
      'maxCount': 5,
    },

  ],
}

log.debug(alarms)
// Alarms.load(alarms)
