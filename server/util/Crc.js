/* jshint esversion:8 */
const crc16 = require('crc').crc16modbus

module.exports = (address, ins) => {
  address = address.toString(16)
  if (address.length < 2) address = '0' + address
  let body = address + ins
  let crc = crc16(Buffer.from(body, 'hex')).toString(16)
  if (crc.length === 3) crc = 0 + crc
  let [a, b, c, d] = [...crc]

  return Buffer.from(body + [c, d, a, b].join(''), 'hex')
}