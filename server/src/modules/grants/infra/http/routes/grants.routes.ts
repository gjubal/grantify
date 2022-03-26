import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';
import GrantsController from '../controllers/GrantsController';
import ensureAuthenticated from '../../../../../common/infra/http/middlewares/ensureAuthenticated';
import ExpensesController from '../controllers/ExpensesController';
import { can } from '../../../../../common/infra/http/middlewares/ensureAuthorized';

const grantsRouter = Router();
const grantsController = new GrantsController();
const expensesController = new ExpensesController();

grantsRouter.use(ensureAuthenticated);

grantsRouter.get('/', grantsController.index);
grantsRouter.get('/:id', can('viewGrant'), grantsController.show);
grantsRouter.post(
  '/',
  can('addGrant'),
  celebrate({
    [Segments.BODY]: {
      grantName: Joi.string().required(),
      openDate: Joi.date().required(),
      closeDate: Joi.date().required(),
      status: Joi.string().required(),
      amountRequested: Joi.number().required(),
      amountApproved: Joi.number(),
      writerName: Joi.string(),
      applicationUrl: Joi.string(),
      sponsoringAgency: Joi.string(),
      dateWhenFundsWereReceived: Joi.date(),
      expirationDate: Joi.date(),
      notes: Joi.string(),
    },
  }),
  grantsController.create,
);

grantsRouter.put('/:id', can('editGrant'), grantsController.update);
grantsRouter.delete('/:id', can('deleteGrant'), grantsController.destroy);

// expense routes
grantsRouter.get('/view/:grantId', expensesController.index);
grantsRouter.get('/view/:grantId/search', expensesController.query);
grantsRouter.get('/view/:grantId/:expenseId', expensesController.show);
grantsRouter.post(
  '/view/:grantId',
  celebrate({
    [Segments.BODY]: {
      name: Joi.string().required(),
      lineItemCode: Joi.number(),
      budget: Joi.number().required(),
      amountSpent: Joi.number(),
      date: Joi.string().required(),
    },
  }),
  expensesController.create,
);
grantsRouter.delete('/view/:grantId/:expenseId', expensesController.destroy);

export default grantsRouter;
