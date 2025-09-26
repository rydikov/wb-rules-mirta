export const CPUs: Record<string, string> = {
  CPU: 'hwmon/CPU Temperature',
}

export const WallSwitches: Record<string, string> = {
  Room1_1: 'wb-mcm8_138/Input 1',
  Room1_2: 'wb-mcm8_138/Input 2',
  Room1_3: 'wb-mcm8_138/Input 3',
  Room1_4: 'wb-mcm8_138/Input 4',
  Room1_5: 'wb-mcm8_138/Input 5',
  Room1_6: 'wb-mcm8_138/Input 6',
  Room1_7: 'wb-mcm8_138/Input 7',
}

export const RelayLights: Record<string, string> = {
  Room1_1: 'wb-mr6cv3_217/K1',
  Room1_2: 'wb-mr6cv3_217/K2',
  Room1_3: 'wb-mr6cv3_217/K3',
  Room1_4: 'wb-mr6cv3_217/K4',
  Room1_5: 'wb-mr6cv3_217/K5',
  Сabinet_01: 'wb-mr6cv3_217/K6',
}

export enum axProStatesEnum {
  Armed = 1,
  StayArmed = 2,
  Disarmed = 3
}

export const AxProAreas: Record<string, string> = {
  GroundFloor: 'AxPro/state_01',
  Bar: 'AxPro/state_02',
  Outdoor: 'AxPro/state_03',
}
