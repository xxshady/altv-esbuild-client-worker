import worker from 'worker!./example.worker'
// can also be imported as:
// but then in this case you will not have typing (autocomplete)
// import worker from './example.worker.js'

// but if you use typescript and import a worker with a .ts extension, the typing will work:
// import worker from './example.worker.ts'

worker.start()
worker.emit('test')