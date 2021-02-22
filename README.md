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
   1. K55 RGB
   2. K95 RGB
   3. K95 RGB PLATINUM
2. Mice
   1. <None> 

## Note
There are no associated Actions or Events defined directly by this plugin yet, only auto created states based on hardware
## Usage
When the plugin starts, if your keyboard/mouse model is detected to have Macro keys, Plug-in States will be auto created related to that type of hardware
For keyboards G keys, 6 new states will be defined
"Corsair G# Key Status" - valid values are "Pressed" or "Released"
For mice M keys, 12 new states will be defined
"Corsair M# Key Status" - valid values are "Pressed" or "Released"

To utilize these in Touch Portal, use the "When Plug-in State Changes" Event

## Future Enhancements
1. RGB Lighting Control
2. Keyboard Specific Lighting Controls
3. Mice Specific Lighting Controls