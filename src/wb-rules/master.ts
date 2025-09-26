import { useMasterControl } from '@wbm/master-control'
import { WallSwitches } from '@wbm/global_devices'

useMasterControl({
  ruleName: 'CABINET_MASTER_CONTROL',
  control: WallSwitches['Room1_1'],
  loads: [
    'Room1_1',
    'Room1_2',
    'Room1_3',
    'Room1_4',
    'Room1_5',
  ],
})
