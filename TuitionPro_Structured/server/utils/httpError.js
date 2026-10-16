export const httpError = (message, status = 400) => Object.assign(new Error(message), { status });
export const validate = (condition, message) => {
  if (!condition) throw httpError(message);
};
