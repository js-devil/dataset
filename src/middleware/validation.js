export default (Schema) => {
  return (req, res, next) => {
    // validation
    try {
      const { error, value } = Schema.validate(req.body);
      if (error === undefined || typeof error === 'undefined') return next();

      const err = new Error(
        error.details
          .map((errorObject) => errorObject.message)
          .toString()
          .replace(/\"/g, '')
      );
      err.statusCode = 400;
      next(err);
    } catch (err) {
      next(err);
    }
  };
};
