const fs = require('fs');
const sdk = require('cue-sdk');
const TP = require("touchportal-api");
const path = require("path");
const ProcessWatcher = require(path.join(__dirname,"/process_watcher"));
const platform = require('process').platform;

const pluginId = 'TPCorsairiCue';
const TPClient = new TP.Client();
const procWatcher = new ProcessWatcher();
let iCueRunning = false;

const app_monitor = {
  "darwin": "UNKNOWN",
  "win32": "iCUE.exe"
};

let modes = new Map();
let hardware = {
  keyboards : [],
  macroKeyboards: [],
  mice :[],
  macroMice: []
};

let keyboardMax = 6;

const macro6Keyboards = [ 'K55 RGB', 'K95 RGB PLATINUM', 'K100 RGB'];
const macro18Keyboards = [ 'K95 RGB' ];
const macroMice = [ 'Scimitar','Scimitar PRO RGB' ];

let reconnect = 0;

function iCueConnect() {
  
  const details = sdk.CorsairPerformProtocolHandshake();
  const errCode = sdk.CorsairGetLastError();
  if (errCode > 0) {
      reconnect++;
      if( reconnect <= 5 ) {
        logIt("INFO",`Connect Error code is ${errCode}, attempting reconnect Count: ${reconnect}`);
        setTimeout(() => { iCueConnect(); }, 5000);
      }
      else {
        logIt("INFO",`Connect Error code is ${errCode}, no longer attempting reconnect`);
      }
      return;
  }
  
  function getAvailableLeds() {
    const leds = []
    const deviceCount = sdk.CorsairGetDeviceCount()
    for (let di = 0; di < deviceCount; ++di) {
      const ledPositions = sdk.CorsairGetLedPositionsByDeviceIndex(di)
      leds.push(ledPositions.map(p => ({ ledId: p.ledId, r: 0, g: 0, b: 0 })))
    }

    return leds;
  }

  const n = sdk.CorsairGetDeviceCount();

  for (let i = 0; i < n; ++i) {
    const info = sdk.CorsairGetDeviceInfo(i);
      logIt("DEBUG","Device Info Found: "+JSON.stringify(info));
    /*if (info.capsMask & sdk.CorsairDeviceCaps.CDC_PropertyLookup) {
      console.log(info);
    }
    if (info.capsMask & sdk.CorsairDeviceCaps.CDC_Lighting) {
      console.log(info);
      const leds = getAvailableLeds();
      console.log(leds);
    }*/

    if( info.type == sdk.CorsairDeviceType.CDT_Keyboard ) {
      hardware.keyboards.push(info);
      if( macro6Keyboards.includes(info.model) ) {
        logIt("DEBUG","A Macro 6 Keyboard was Found");
        hardware.macroKeyboards.push(info);
      }
      else if( macro18Keyboards.includes(info.model) ) {
        logIt("DEBUG","A Macro 18 Keyboard was Found");
        keyboardMax = 18;
        hardware.macroKeyboards.push(info);
      }
    }
    else if( info.type == sdk.CorsairDeviceType.CDT_Mouse ) {
      hardware.mice.push(info);
      if( macroMice.includes(info.model) ) {
        logIt("DEBUG","A Macro Mouse Found");
        hardware.macroMice.push(info);
      }
    }
  }

  let createKeyboardMacroKeyStates = () => {
    for( let i = 1; i <= keyboardMax; i++ ){
      logIt("DEBUG","Creating State "+`Corsair_G${i}_Key_Status`);
      TPClient.createState(`Corsair_G${i}_Key_Status`,`Corsair G${i} Key Status`,'Released');
    }
  };
  let createMiceMacroKeyStates = () => {
    for( let i = 1; i <= 12; i++ ){
      TPClient.createState(`Corsair_M${i}_Key_Status`,`Corsair M${i} Key Status`,'Released');
    }
  };

  if( hardware.macroKeyboards.length > 0  ) {
    createKeyboardMacroKeyStates();
  }
  if( hardware.macroMice.length > 0 ) {
    createMiceMacroKeyStates();
  }

  sdk.CorsairSubscribeForEvents((event) =>  { 
    logIt("DEBUG",JSON.stringify(event));
    if( event.id === 'macrokeydown' ) {
      if( event.keyId < 19 ) {
        TPClient.stateUpdate(`Corsair_G${event.keyId}_Key_Status`,'Pressed');
      }
      else if( event.keyId > 18 ) {
        let keyId = event.keyId % 18;
        TPClient.stateUpdate(`Corsair_M${keyId}_Key_Status`,'Pressed');
      }
    }
    if( event.id === 'macrokeyup' ) {
      if( event.keyId < 19 ) {
        TPClient.stateUpdate(`Corsair_G${event.keyId}_Key_Status`,'Released');
      }
      else if( event.keyId > 18 ) {
        let keyId = event.keyId % 18;
        TPClient.stateUpdate(`Corsair_M${keyId}_Key_Status`,'Released');
      }
    }
  });
}

/*
// Read in mode files
const modeFiles = fs.readdirSync('./src/modes').filter(file => file.endsWith('.js'));

for (const file of modeFiles) {
	const mode = require(`./modes/${file}`);
	modes.set(mode.name, mode);
}
*/

// Process Watcher
procWatcher.on('processRunning', (processName) => {
  iCueRunning = true;
  // Lets shutdown the connection so we can re-establish it
  setTimeout(function() {
      logIt('INFO', "iCue is running, attempting to Connect");
      iCueConnect();
  }, 1000);
});
procWatcher.on('processTerminated', (processName) => {
  logIt('WARN',`${processName} not detected as running`);
  if( !iCueRunning ) {
      // We already did this once, don't need to keep repeating it
      return;
  }
  logIt('WARN',`Disconnect active connections to iCue`);
  iCueRunning = false;
  sdk.CorsairUnsubscribeFromEvents()
});




TPClient.on("Info", (data) => {
  logIt("DEBUG","Info : We received info from Touch-Portal");

 
  if( platform != "darwin" ) {
    logIt('INFO',`Starting process watcher for ${app_monitor[platform]}`);
    procWatcher.watch(app_monitor[platform]);
  }
});

TPClient.on("connected", () => {
  logIt("DEBUG","We are connected");
});

function logIt() {
  var curTime = new Date().toISOString();
  var message = [...arguments];
  var type = message.shift();
  console.log(curTime,":",pluginId,":"+type+":",message.join(" "));
}


// We are going to connect to TP
// That way if TP shuts down the plugin will be shutdown too
TPClient.connect({ pluginId });