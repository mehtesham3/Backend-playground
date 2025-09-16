export const validate = (Schema) => {
  return (req, res, next) => {
    const { error } = Schema.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: "Validate failes",
        error: error.details.map((err) => err.message),
      });
    }
    next();
  };
};