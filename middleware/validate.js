export const validateRequest = ({ body, params, query } = {}) => {
  return async (req, res, next) => {
    try {
      if (body) {
        const result = await body.safeParseAsync(req.body);
        if (!result.success) {
          return res.status(400).json({
            error: 'Invalid request body',
            details: result.error.flatten(),
          });
        }
        req.body = result.data;
      }

      if (params) {
        const result = await params.safeParseAsync(req.params);
        if (!result.success) {
          return res.status(400).json({
            error: 'Invalid route parameters',
            details: result.error.flatten(),
          });
        }
        req.params = result.data;
      }

      if (query) {
        const result = await query.safeParseAsync(req.query);
        if (!result.success) {
          return res.status(400).json({
            error: 'Invalid query parameters',
            details: result.error.flatten(),
          });
        }
        req.query = result.data;
      }

      return next();
    } catch (error) {
      return next(error);
    }
  };
};
