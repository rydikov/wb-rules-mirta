import { PresenceSensors, RelayLights } from '#wbm/global-devices'
import { makeBacklightRule } from '#wbm/rule_makers/backlight'

makeBacklightRule(
  'CABINET_BACKLIGHT',
  PresenceSensors.Cabinet,
  'Backlights/cabinet',
  RelayLights.Cabinet_01,
  120000
)
