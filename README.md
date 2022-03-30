# TouchPortal_Corsair_iCue
Touch Portal Corsair iCue integration

- [TouchPortal_Corsair_iCue](#touchportal_corsair_icue)
  - [Description](#description)
  - [Note](#note)
  - [Usage](#usage)
  - [Future Enhancements](#future-enhancements)

## Description
Integration to your Corsair iCue compatible devices

Currently only supporting G and M Keys from Specific Models

1. Keyboards
   1. K55 RGB - 6 G Macro Keys
   2. K55 RGB PRO - 6 G Macro Keys
   3. K55 RGB PRO XT - 6 G Macro Keys
   4. K57 RGB - 6 G Macro Keys
   5. K95 RGB - 18 G Macro Keys
   6. K95 RGB PLATINUM - 6 G Macro Keys
   7. K95 RGB PLATINUM SE - 6 G Macro Keys
   8. K95 RGB PLATINUM XT - 6 G Macro Keys
   9. K100 RGB - 6 G Macro Keys
2. Mice
   1. Scimitar - 12 M Macro Keys
   2. Scimitar PRO RGB - 12 M Macro Keys

## Note
There are no associated Actions or Events defined directly by this plugin yet, only auto created states based on hardware
## Usage
When the plugin starts, if your keyboard/mouse model is detected to have Macro keys, Plug-in States will be auto created related to that type of hardware

For keyboards G keys, 6 or 18 new states will be defined <br/>
"Corsair G# Key Status" - valid values are "Pressed" or "Released"

For mice M keys, 12 new states will be defined <br/>
"Corsair M# Key Status" - valid values are "Pressed" or "Released"

To utilize these in Touch Portal, use the "When Plug-in State Changes" Event

## Future Enhancements
1. RGB Lighting Control
2. Keyboard Specific Lighting Controls
3. Mice Specific Lighting Controls