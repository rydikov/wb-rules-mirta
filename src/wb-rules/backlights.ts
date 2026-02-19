export const backlightControls: WbRules.ControlOptionsTree = {
  cabinet: {
    title: 'Подсветка в кабинете',
    type: 'switch',
    value: true,
  },
  main_staircase: {
    title: 'Подсветка основной лестницы',
    type: 'switch',
    value: true,
  },
  first_floor: {
    title: 'Подсветка первого этажа',
    type: 'switch',
    value: true,
  },
  second_floor: {
    title: 'Подсветка второго этажа',
    type: 'switch',
    value: true,
  },
  bathroom_first_floor: {
    title: 'Подсветка санузла на первом этаже',
    type: 'switch',
    value: true,
  },
  bathroom_second_floor: {
    title: 'Подсветка ванной комнаты на втором этаже',
    type: 'switch',
    value: true,
  },
  toilet_second_floor: {
    title: 'Подсветка в туалете на втором этаже',
    type: 'switch',
    value: true,
  },
}

defineVirtualDevice('Backlights', {
  title: 'Подсветки',
  cells: backlightControls,
})
