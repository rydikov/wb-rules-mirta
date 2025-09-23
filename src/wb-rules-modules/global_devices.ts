const LightINChannelsNames: Record<string, string> = {
  Room1_0: 'wb-mr6cv3_217/Input 0',
  Room1_1: 'wb-mr6cv3_217/Input 1',
  Room1_2: 'wb-mr6cv3_217/Input 2',
  Room1_3: 'wb-mr6cv3_217/Input 3',
  Room1_4: 'wb-mr6cv3_217/Input 4',
  Room1_5: 'wb-mr6cv3_217/Input 5',
  Сabinet_01: 'wb-mr6cv3_217/Input 6',
}

const LightOUTChannelsNames: Record<string, string> = {
  Room1_1: 'wb-mr6cv3_217/K1',
  Room1_2: 'wb-mr6cv3_217/K2',
  Room1_3: 'wb-mr6cv3_217/K3',
  Room1_4: 'wb-mr6cv3_217/K4',
  Room1_5: 'wb-mr6cv3_217/K5',
  Сabinet_01: 'wb-mr6cv3_217/K6',
}

export const LIGHTS = {
  IN: {
    Index: (name: string): string => LightINChannelsNames[name],
    Get: (name: string): boolean => !!dev[LightINChannelsNames[name]],
  },

  OUT: {
    Index: (name: string): string => LightOUTChannelsNames[name],
    Get: (name: string): boolean => !!dev[LightOUTChannelsNames[name]],
    On: (name: string, nolog?: boolean): void => {

      const idx = LightOUTChannelsNames[name]
      const loaded_dev = getControl(idx)
      loaded_dev?.setValue(true)

      if (!nolog)
        log(`Включен "${name}": ${idx}`)

    },
    Off: (name: string, nolog?: boolean): void => {

      const idx = LightOUTChannelsNames[name]
      const loaded_dev = getControl(idx)
      loaded_dev?.setValue(false)

      if (!nolog)
        log(`Отключен "${name}": ${idx}`)

    },
    List: (): string[] => Object.keys(LightOUTChannelsNames),
  },
}
