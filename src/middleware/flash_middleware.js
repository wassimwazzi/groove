const flashMiddleware = (req, res, next) => {
  res.locals.messages = req.flash()
  next()
}

export default flashMiddleware
