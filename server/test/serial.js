/* jshint esversion:8 */
const serialIO = require('../serial-io/index')
const ins = require('./result')

async function test() {
  let ports = await serialIO.ports()
  let devlistOnline = ports.filter(el => el.productId != undefined)

  console.log(await devlistOnline)

  /* //ups
    let con = await serialIO.connect('/dev/ttyUSB0',{baudRate:2400,terminator:'\r',timeoutInit:1000,timeoutRolling:1000})
    for(let el of Object.keys(ins)){        
        await con.send(`${el}\r`).then(res=>{         
             console.log(el+"::"+res.slice(1,res.length));            
         })
     } */

  /* //let QGS = await serialIO.send('/dev/ttyUSB0','QGS\n\r',{baudRate:2400,terminator:"0d"})
    let QGS = await con.send('QGS\r')
    //await con.close()
    let QPI = await  con.send('QPI\r')
    console.log(await QGS);
    
    console.log(QPI); */

  /* let con1 = await serialIO.connect('/dev/ttyUSB0', {
    baudRate: 9600,
    timeoutInit: 1000,
    timeoutRolling: 1000
  })
  await con1.send(Buffer.from('010300000002C40B', 'hex')).then(res => {
    console.log(res)
  })
  while (true) {
    setTimeout(() => {}, 5000)
    await con1.send(Buffer.from('010300000002C40B', 'hex')).then(res => {
      console.log(new Date())

      console.log(res)
    })
  }
  console.log('end') */
}

test()
