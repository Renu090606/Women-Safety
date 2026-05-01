const errorHandler = (error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  return res.status(status).json({ error: status === 500 ? 'Something went wrong. Please try again.' : (error.message || 'Request failed') });
};

module.exports = { errorHandler };
