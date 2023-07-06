const db = require("../db/models/index");

const { User, Calendar, UserCalendar, Pending } = db;

// Check & get single user
async function getPendings(req, res) {
  const { email, calendarId } = req.params;
  try {
    const pending = await Pending.findAll({
      where: {
        calendarId: calendarId,
        email: email,
      },
    });
    return res.json(pending);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

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

async function deletePending(req, res) {
  const { email, calendarId } = req.params;
  try {
    await Pending.destroy({ where: { calendarId: calendarId, email: email } });

    return res.json({ msg: "Deleted pending" });
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

module.exports = {
  getPendings,
  insertPendingInvites,
  deletePending,
};
