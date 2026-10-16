import { query } from '../configs/db.js';
const Material = {
  findById: async (id) => (await query('SELECT * FROM materials WHERE id=?', [id]))[0],
  remove: (id) => query('DELETE FROM materials WHERE id=?', [id]),
};
export default Material;
