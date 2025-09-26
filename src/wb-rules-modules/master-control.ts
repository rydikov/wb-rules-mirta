import { RelayLight } from '@wbm/wb_classes'

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
        new RelayLight(load).off()
      })

      log.debug('Весь свет выключен')
    },
  })
}
