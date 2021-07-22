import { Context, Allocation } from '../gameloop'

const test = async () => {
  const start = process.hrtime.bigint()

  await Allocation.extend('data/item', 1024 * 1024 * 1)
  .catch(e => {
    console.log(e)
  })

  // console.log('extension took:', parseInt((process.hrtime.bigint() - start).toString()) / 1000000, 'ms')
  console.log('extended to:', Allocation.get('data/item').buffer?.byteLength)

  await new Promise((resolve, reject) => setTimeout(() => {

    test()
    .then(resolve)
    .catch(reject)

  }, 1000))
}

test()
