import { lstat } from 'fs/promises'
import { cwd } from 'process'
import { ipcRenderer as nodeEventBus } from 'electron'

nodeEventBus.on('main-process-message', (_event, ...args) => {
  console.log('[Receive Main-process message]:', ...args)
})

lstat(cwd()).then(stats => {
  console.log('[fs.lstat]', stats)
}).catch(err => {
  console.error(err)
})
