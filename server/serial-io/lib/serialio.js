/* jshint esversion:8 */
const serialport = require('serialport');
const Connection = require('./connection').default;

class SerialIo {
  /**
   * Get list of all available ports.
   * @returns {Promise} Resolves to array of port objects
   *                             https://github.com/EmergingTechnologyAdvisors/node-serialport#module_serialport--SerialPort.list
   */
  /* static ports () {
    return new Promise((resolve, reject) => {
      serialport.list((err, ports) => {
        if (err) {
          reject(new Error(err))
        } else {
          resolve(ports)
        }
      })
    })
  } */
  static async ports() {
    return await serialport.list();
  }

  /**
   * Send a single command to a port.
   * @return {Promise} Resolves to response.
   */
  static async send(portName, content, opts) {
    let con = await this.connect(portName,opts);
    let res = await con.send(content,opts);
    await con.close();
    return res;
    /* return content(portName, opts)
      .then(con => {
        return con.send(content, opts)
      })
      .then(res => {
        con.close()
        return res
      }) */
    /* let connection
    return new Connection(portName, opts)
      .then(conn => {
        connection = conn
        return connection.send(content, opts)
      })
      .then(response => {
        connection.close()
        return response
      }) */
  }
  /**
   * @return {Promise} Resolves to response.
   */
  static async connect(portName, options) {
    let con = new Connection(portName, options);
    return await con;
  }
}

module.exports = SerialIo;
