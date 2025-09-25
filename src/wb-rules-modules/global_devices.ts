export const DefinedVersion = '0.1' // При редактировании этих переменных необходимо менять версию, чтобы переопределять глобальные пемеремные

// const LightINChannelsNames: Record<string, string> = {
//   Room1_0: 'wb-mr6cv3_217/Input 0',
//   Room1_1: 'wb-mr6cv3_217/Input 1',
//   Room1_2: 'wb-mr6cv3_217/Input 2',
//   Room1_3: 'wb-mr6cv3_217/Input 3',
//   Room1_4: 'wb-mr6cv3_217/Input 4',
//   Room1_5: 'wb-mr6cv3_217/Input 5',
//   Сabinet_01: 'wb-mr6cv3_217/Input 6',
// }

export const CPUs: Record<string, string> = {
  CPU: 'hwmon/CPU Temperature',
}

export const RelayLights: Record<string, string> = {
  Room1_1: 'wb-mr6cv3_217/K1',
  Room1_2: 'wb-mr6cv3_217/K2',
  Room1_3: 'wb-mr6cv3_217/K3',
  Room1_4: 'wb-mr6cv3_217/K4',
  Room1_5: 'wb-mr6cv3_217/K5',
  Сabinet_01: 'wb-mr6cv3_217/K6',
}

export const AxProAreas: Record<string, string> = {
  GroundFloor: 'AxPro/state_01',
  Bar: 'AxPro/state_02',
  Outdoor: 'AxPro/state_03',
}
