// Use this middleware for requests that should be cached
// The cache should be cleared when the page is refreshed
// TODO: not actually working yet
const cacheRequest = (req, res, next) => {
  res.set('Cache-Control', 'no-store')
  next()
}

export default cacheRequest
