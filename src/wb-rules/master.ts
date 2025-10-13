import { useMasterControl } from '@wbm/master-control'
import { WallSwitches, RelayLights } from '@wbm/global_devices'

useMasterControl({
  ruleName: 'CABINET_MASTER_CONTROL',
  control: WallSwitches['Room1_1'],
  loads: [
    RelayLights.Room1_1,
    RelayLights.Room1_2,
    RelayLights.Room1_3,
    RelayLights.Room1_4,
    RelayLights.Room1_5,
  ],
})
