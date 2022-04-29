import { Router } from 'express';
import { celebrate, Joi, Segments } from 'celebrate';

import UsersController from '../controllers/UsersController';
import ensureAuthenticated from '../../../../../common/infra/http/middlewares/ensureAuthenticated';
import { can } from '../../../../../common/infra/http/middlewares/ensureAuthorized';

const usersRouter = Router();
const usersController = new UsersController();

usersRouter.get('/', ensureAuthenticated, usersController.index);
usersRouter.get('/:id', ensureAuthenticated, usersController.show);

usersRouter.post(
  '/',
  celebrate({
    [Segments.BODY]: {
      first_name: Joi.string().required(),
      last_name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    },
  }),
  usersController.create,
);

usersRouter.delete(
  '/:id',
  ensureAuthenticated,
  can('editPermissions'),
  usersController.destroy,
);

export default usersRouter;
