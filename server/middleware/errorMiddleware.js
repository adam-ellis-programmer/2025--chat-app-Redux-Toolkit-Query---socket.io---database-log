// Middleware to handle requests to undefined routes and return a 404 error.
const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  // When we call next(error) with an argument,
  // Express skips ALL normal middleware and jumps
  // directly to ERROR HANDLING middleware!
  res.status(404)
  next(error)
}

// Middleware to handle errors, set appropriate status codes, and return error details.
const errorHandler = (err, req, res, next) => {
  // console.log('error--->', err)
  // This 'err' parameter contains the error from notFound!
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode
  let message = err.message

  // Handle specific Mongoose errors
  if (err.name === 'CastError') {
    message = 'Resource not found'
    statusCode = 404
  }

  if (err.code === 11000) {
    message = 'Duplicate field value entered'
    statusCode = 400
  }

  if (err.name === 'ValidationError') {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ')
    statusCode = 400
  }

  // Always return JSON response
  res.status(statusCode).json({
    success: false,
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  })
}

export { notFound, errorHandler }
