/*
Based on example code from: https://github.com/CorsairOfficial/cue-sdk-node/tree/master/example/color_pulse

MIT License

Copyright (c) 2020 Corsair Memory, Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

function performPulseEffect(sdk, allLeds, colors) {
  const cnt = allLeds.length
  for (let di = 0; di < cnt; ++di) {
    const device_leds = allLeds[di]
    device_leds.forEach(led => {
      led.r = colors.r
      led.g = colors.g
      led.b = colors.b
    })

    sdk.CorsairSetLedsColorsBufferByDeviceIndex(di, device_leds)
  }
  sdk.CorsairSetLedsColorsFlushBuffer()
}

function colorPulse( sdk, leds) {

  function loop(availableLeds, waveDuration, colors) {
    const TIME_PER_FRAME = 25

    performPulseEffect(sdk, availableLeds, colors)
    return setTimeout(
      loop,
      TIME_PER_FRAME,
      avilableLeds,
      waveDuration,
      (x + TIME_PER_FRAME / waveDuration) % 2
    )
  }

  return loop(leds, pulseDuration, colors)
}

module.exports = {
  name: 'single-color-pulse',
  description: 'Single Color Pulse',
  start: (pluginId, sdk, leds, colors ) => {
    if( !leds.length ) {
      console.log(pluginId," ERROR: Cannot have empty led array");
      return false;
    }
    if( colors.r == null || colors.g == null || colors.b == null ) {
      console.log(pluginId," ERROR: Cannot have empty color object");
      return false;
    }

    colorPulse(sdk,leds,colors);
  },
  stop: () => { stop() }
}