const serial = require('../util/SerialPort')
const crc = require("../util/Crc")

async function test() {
  console.log(await serial.ports())

  const tty1 = new serial("/dev/ttyUSB0",{baudRate:9600})

  tty1.send(crc(1,"03000A0006")).then(res=>{
      console.log(res);
      
  })

}

test()
