import sinon from 'sinon'

before(() => {
  sinon.stub(process, 'env').value({
    SPOTIFY_CLIENT_ID: 'spotify_client_id',
    SPOTIFY_CLIENT_SECRET: 'spotify_client_secret',
    PORT: 'port',
    URL: 'url',
    HTTP_SECURE: 'false',
  })
})

after(() => {
  sinon.restore()
})
