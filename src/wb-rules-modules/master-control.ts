export function useMasterControl(options: {
  ruleName: string
  control: string
  loads: string[]
}) {
  const { ruleName, control, loads } = options

  defineRule(ruleName, {
    whenChanged: control,
    then: function (newValue) {
      if (!newValue)
        return

      loads.forEach((load) => {
        // const loaded_dev = getControl(load)
        // loaded_dev?.setValue(false)
        dev[load] = false
      })

      log.debug('Весь свет выключен')
    },
  })
}
