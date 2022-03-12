import { Request, Response } from 'express';
import { container } from 'tsyringe';

import CreateGrantService from '../../../../../modules/grants/services/CreateGrantService';
import ListGrantsService from '../../../../../modules/grants/services/ListGrantsService';
import RemoveGrantService from '../../../../../modules/grants/services/RemoveGrantService';
import ShowGrantService from '../../../../../modules/grants/services/ShowGrantService';
import UpdateGrantService from '../../../../../modules/grants/services/UpdateGrantService';

export default class GrantsController {
  public async index(request: Request, response: Response): Promise<Response> {
    const listGrants = container.resolve(ListGrantsService);

    const grants = await listGrants.findAll();

    return response.json(grants);
  }

  public async show(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showGrantByName = container.resolve(ShowGrantService);

    const grant = await showGrantByName.execute({ grantId: id });

    return response.json(grant);
  }

  public async create(request: Request, response: Response): Promise<Response> {
    const {
      grantName,
      openDate,
      closeDate,
      status,
      amountRequested,
      amountApproved,
      writerName,
      applicationUrl,
      sponsoringAgency,
      dateWhenFundsWereReceived,
      expirationDate,
    } = request.body;

    const createGrant = container.resolve(CreateGrantService);

    const grant = await createGrant.execute({
      grantName,
      openDate,
      closeDate,
      status,
      amountRequested,
      amountApproved,
      writerName,
      applicationUrl,
      sponsoringAgency,
      dateWhenFundsWereReceived,
      expirationDate,
    });

    return response.json(grant);
  }

  public async update(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const {
      grantName,
      openDate,
      closeDate,
      status,
      amountRequested,
      amountApproved,
      writerName,
      applicationUrl,
      sponsoringAgency,
      dateWhenFundsWereReceived,
      expirationDate,
    } = request.body;

    const updateGrant = container.resolve(UpdateGrantService);

    const grant = await updateGrant.execute({
      id,
      grantName,
      openDate,
      closeDate,
      status,
      amountRequested,
      amountApproved,
      writerName,
      applicationUrl,
      sponsoringAgency,
      dateWhenFundsWereReceived,
      expirationDate,
    });

    return response.json(grant);
  }

  public async destroy(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { id } = request.params;

    const deleteGrant = container.resolve(RemoveGrantService);

    const grant = await deleteGrant.execute({
      id,
    });

    return response.json(grant);
  }
}
