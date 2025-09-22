import { useMasterControl } from '@wbm/master-control'

useMasterControl({
  ruleName: 'MASTER_CONTROL',
  control: 'wb-mcm8_138/Input 7',
  loads: [
    'wb-mrm2-mini_40/K1',
    'wb-mrm2-mini_40/K2',
  ],
})
