const db = require("../db/models/index");

const { User, Calendar, UserCalendar, Pending } = db;

// Check & get single user
async function insertPendingInvites(req, res) {
  const { invitees } = req.body;
  try {
    const newPending = await Pending.bulkCreate(invitees);
    return res.json(newPending);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  insertPendingInvites,
};
