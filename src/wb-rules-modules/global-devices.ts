import { RelayLight, DimmableLight } from '#wbm/classes/wb'
import { AqaraSensor } from '#wbm/classes/aqara'
import { MTDX62MB } from '#wbm/classes/mtdx62-mb'
import { AstroTimerCls } from '#wbm/classes/other'

export const CPUs: Record<string, string> = {
  CPU: 'hwmon/CPU Temperature',
}

// Выключатели по группам в комнатах см. docs
export const WallSwitches: Record<string, string> = {
  Room1_1: 'wb-mcm8_138/Input 1',
  Room1_2: 'wb-mcm8_138/Input 2',
  Room1_3: 'wb-mcm8_138/Input 3',
  Room1_4: 'wb-mcm8_138/Input 4',
  Room1_5: 'wb-mcm8_138/Input 5',
  Room1_6: 'wb-mcm8_138/Input 6',
  Room1_7: 'wb-mcm8_138/Input 7',
}

// Обычный свет у которого есть on/off
export const RelayLights: Record<string, RelayLight> = {
  Room1_1: new RelayLight('wb-mr6cv3_217/K1'),
  Room1_2: new RelayLight('wb-mr6cv3_217/K2'),
  Room1_3: new RelayLight('wb-mr6cv3_217/K3'),
  Room1_4: new RelayLight('wb-mr6cv3_217/K4'),
  Room1_5: new RelayLight('wb-mr6cv3_217/K5'),
  Cabinet_01: new RelayLight('wb-mr6cv3_217/K6'),
}

// Диммируемый свет на MDM3, в настройках модуля должны быть установки для лампы
export const DimmableLights: Record<string, DimmableLight> = {
  Cabinet: new DimmableLight('wb-mdm3_77/K1'),
}

// Датчики температуры/влажности Aqara
export const AqaraSensors: Record<string, AqaraSensor> = {
  Cabinet_01: new AqaraSensor('AqaraTS01'),
}

// Датчики присутствия
export const PresenceSensors: Record<string, MTDX62MB> = {
  Cabinet_01: new MTDX62MB('mtdx62-mb_7'),
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

// Астрономический таймер
export const AstroTimer = new AstroTimerCls('AstroTimer')
