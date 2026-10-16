export default function errorHandler(error, req, res, next) {
  console.error(error.message);
  const duplicate = error.code === 'ER_DUP_ENTRY';
  const message = duplicate
    ? 'Email already registered'
    : error.code === 'LIMIT_FILE_SIZE'
      ? 'File exceeds upload limit'
      : error.status
        ? error.message
        : 'Request failed. Check the API terminal and database settings.';
  res.status(duplicate ? 409 : error.status || 500).json({ error: message });
}
