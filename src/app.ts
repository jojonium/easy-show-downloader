import Hapi from '@hapi/hapi'

const init = async (): Promise<void> => {
  const server = Hapi.server({
    port: 8080,
    host: 'localhost'
  })
  await server.start()
  console.log(`Started easy-show-downloader on ${server.info.uri}`)
}

init().catch((err) => {
  console.error(err)
  process.exit(1)
})
