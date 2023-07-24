const db = require("../db/models/index");

const { Pending } = db;

// get pending associatedd with user and calendar
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

// insert user and calendar to pending table
async function insertPendingInvites(req, res) {
  const { invitees } = req.body;
  try {
    const newPending = await Pending.bulkCreate(invitees);
    return res.json(newPending);
  } catch (err) {
    return res.status(400).json({ error: true, msg: err });
  }
}

// delete pending
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
