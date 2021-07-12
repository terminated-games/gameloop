const { default: Shared } = require('../module/shared')
const { Terminal } = require('../module/index')
const { default: Allocation } = require('../module/shared/allocation')

console.log(Allocation)

const data = new Allocation(1024)



Shared.process([
  'process/gateway',
  'process/auth',
  
  'process/environment',
  'process/ai',
  'process/player'
])
.then(async () => {
  for (const process of Shared.process_list)
  {
    await process.share(data, data.length, data.buffer)
  }
  // Terminal.listen()
})
.then(() => {
  console.log('main process ready')
})
.catch(e => {
  console.error(e)
})