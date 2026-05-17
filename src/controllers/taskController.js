const taskModel = require('../models/taskModel');

async function create(req, res, next) {
  try {
    const task = await taskModel.create(req.userId, req.body);
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function getAll(req, res, next) {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.due_date) filters.due_date = req.query.due_date;

    const tasks = await taskModel.findAllByUser(req.userId, filters);
    res.json({ success: true, data: tasks });
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const task = await taskModel.findByIdForUser(Number(req.params.id), req.userId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const task = await taskModel.update(
      Number(req.params.id),
      req.userId,
      req.body
    );
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }
    res.json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await taskModel.remove(Number(req.params.id), req.userId);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada',
      });
    }
    res.json({ success: true, message: 'Tarea eliminada' });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getAll, getOne, update, remove };
