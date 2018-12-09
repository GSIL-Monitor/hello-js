/* eslint-disable */
require('shelljs/global')

let path = require('path')
let fs = require('fs')
let chalk = require('chalk')
let ora = require('ora')

let client = require('scp2')
let envCfg;

let deployConf = require('./deployConf.json')

let NODE_ENV = process.env.NODE_ENV

if (NODE_ENV === 'beta') {
  envCfg = deployConf['beta']
}
if (NODE_ENV === 'huangzhijing') {
  envCfg = deployConf['hzj']
}

let spinner = ora('deploying....  ')

spinner.start()

const root = path.resolve(__dirname, 'train')
  // console.log(path.resolve(__dirname, 'light-signal'))

// cp('-R', 'package.json', root)
// cp('-R', 'od.config.js', root)

console.log(chalk.yellow('\n  Start to deploying....\n'))

client.scp(root, envCfg, function (err) {
  spinner.stop()
  if (err) {
    console.log(err)
  } else {
    console.log(chalk.green('\n  deploy finished'))
  }
})
