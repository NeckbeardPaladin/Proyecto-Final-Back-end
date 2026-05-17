const { Router } = require('express');
const { body, param, query } = require('express-validator');
const taskController = require('../controllers/taskController');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');

const router = Router();

const statusValues = ['pending', 'in_progress', 'done'];

const createRules = [
  body('title').trim().notEmpty().withMessage('El título es obligatorio'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage('Status inválido'),
  body('due_date').optional().isISO8601().withMessage('Fecha inválida'),
];

const updateRules = [
  param('id').isInt({ min: 1 }).withMessage('ID inválido'),
  body('title').optional().trim().notEmpty().withMessage('El título no puede estar vacío'),
  body('description').optional().isString(),
  body('status')
    .optional()
    .isIn(statusValues)
    .withMessage('Status inválido'),
  body('due_date').optional().isISO8601().withMessage('Fecha inválida'),
];

const idParam = [param('id').isInt({ min: 1 }).withMessage('ID inválido')];

const listQueryRules = [
  query('status')
    .optional()
    .isIn(statusValues)
    .withMessage('Status inválido'),
  query('due_date').optional().isISO8601().withMessage('Fecha inválida'),
];

router.use(auth);

router.post('/', createRules, validate, taskController.create);
router.get('/', listQueryRules, validate, taskController.getAll);
router.get('/:id', idParam, validate, taskController.getOne);
router.put('/:id', updateRules, validate, taskController.update);
router.delete('/:id', idParam, validate, taskController.remove);

module.exports = router;
