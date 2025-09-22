// Подключаем симулятор контроллера.
import { useSimulator } from '@mirta/testing'
// Подключаем тестируемый модуль правил.
import { useMasterControl } from '@wbm/master-control'

const simulator = useSimulator()

beforeEach(() => {

  // Перезагружает симулятор перед каждым тестом.
  simulator.reset()

})

test('Master Control test', () => {

  // Источник сигнала.
  const control = 'wb-mcm8_138/Input 7'

  // Тестируемый код.
  useMasterControl({
    ruleName: 'MASTER_CONTROL',
    control,
    loads: [
      'wb-mrm2-mini_40/K1',
      'wb-mrm2-mini_40/K2',
    ],
  })

  // Имитация сигнала на контроллере.
  simulator.defineRule.run({
    topic: control,
    value: true,
  })

  // Проверка состояния нагрузки.
  expect(dev['wb-mrm2-mini_40/K1']).toBeFalsy()

})
