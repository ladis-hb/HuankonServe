/* jshint esversion:8 */
const Serialport = require('serialport')

class Connection {
  constructor(
    portName,
    options = { autoOpen, terminator, timeoutRolling, timeoutInit, baudRate }
  ) {
    this.options = Object.assign({ autoOpen: true }, options || {})
    this.state = Connection.states().INIT
    try {
      this.port = new Serialport(portName, options)
      this.state = Connection.states().OPEN
    } catch (error) {
      this.state = Connection.states().ERROR
    }
    this.port.on('error', err => {
      console.log(err)
      this.state = Connection.states().ERROR
    })
    this.port.on('close', err => {
      console.log(err)
      this.state = Connection.states().CLOSED
    })
  }

  close() {
    this.port.close(err => {
      if (err) {
        console.log(3)
        this.state = Connection.states().ERROR
      } else this.state = Connection.states().CLOSED
    })
  }

  open() {
    //this.port.isOpen
    this.port.open(err => {
      if (err) {
        this.state = Connection.states().OPEN
        return true
      } else {
        this.state = Connection.states().ERROR
        return false
      }
    })
  }

  async send(content, opts) {
    if (this.state !== Connection.states().OPEN)
      return Promise.reject(new Error('instance not in state OPEN'))

    opts = Object.assign(this.options, opts || {})
    const terminator = opts.terminator || ''
    const timeoutInit = opts.timeoutInit || 100
    const timeoutRolling = opts.timeoutRolling || 100

    this.state = Connection.states().INUSE
    let timer = null

    let result = null
    switch (typeof content) {
      case 'string':
        result = new Promise((res, rej) => {
          let chunks = ''
          this.port.on('data', data => {
            if (timer) clearTimeout(timer)
            chunks = chunks.concat(data)
            if (terminator && chunks.includes(terminator)) {
              this.state = Connection.states().OPEN
              this.port.removeAllListeners()
              res(chunks)
            }
          })
          timer = setTimeout(() => rej(false), timeoutRolling)
        })
        break
      default:
        result = new Promise((res, rej) => {
          let bfArray = [],
            i = 0,
            end = 0
          this.port.on('data', data => {
            if (timer) clearTimeout(timer)
            i += data.length
            bfArray.push(data)
            if (end == 0 && i > 2)
              end =
                Buffer.concat(bfArray, i)
                  .slice(2, 3)
                  .readUInt8() + 5
            if (i == end) {
              this.state = Connection.states().OPEN
              this.port.removeAllListeners()
              res(Buffer.concat(bfArray, i).slice(3, end - 2))
            }
          })
          timer = setTimeout(() => {
            this.state = Connection.states().OPEN
            this.port.removeAllListeners()
            rej(false)
          }, timeoutRolling)
        })
        break
    }
    this.port.write(content)
    await result
    return result
  }

  getState() {
    return this.state
  }

  static states() {
    return {
      INIT: 'INIT',
      ERROR: 'ERROR',
      OPEN: 'OPEN',
      CLOSED: 'CLOSED',
      INUSE: 'IN_USE'
    }
  }

  static async ports() {
    let ports = await Serialport.list()
    return ports.filter(el => el.productId != undefined)
  }
}

module.exports = Connection
