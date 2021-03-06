const MongooseRepository = require('../shared/database/repositories/mongooseRepository');

const GameTokenService = require('../shared/services/gameTokenService');

const MinigameOverviewService = require('../shared/services/minigameOverviewService');

const mongoose = require('../shared/database/mongoDatabase');

const { createBaseResponse } = require('../shared/http/responseUtils');

const errorMessages = require('../shared/constants/errorMessages');

const infoMessages = require('../shared/constants/infoMessages');

require('../shared/database/models/userAccount');
require('../shared/database/models/minigameOverview');

// eslint-disable-next-line func-names
module.exports = async function (context, req) {
  context.log.info(`[GetMinigameOverview] Function has been called! - ${context.invocationId}`);

  if (!req.headers['game-token']) {
    context.log.info(`Empty gameToken header. InvocationId: ${context.invocationId}`);

    context.res = {
      status: 403,
      body: createBaseResponse(false, false, errorMessages.GAMETOKEN_HEADER_NOT_FOUND, null),
    };
    context.done();
    return;
  }

  try {
    const mongoClient = await mongoose.connect(process.env.MONGO_CONNECTION, context);

    const userAccountRepository = new MongooseRepository(mongoClient.model('UserAccount'));
    const gameTokenService = new GameTokenService(userAccountRepository, context);

    context.log.info('Validating Token Account...');

    const isValidated = gameTokenService.validate(req.headers['game-token']);
    if (!isValidated) {
      context.log(`Game Token is invalid. InvocationId: ${context.invocationId}`);

      context.res = {
        status: 403,
        body: createBaseResponse(false, false, errorMessages.INVALID_TOKEN, null),
      };
      context.done();
      return;
    }

    const minigameOverviewRepository = new MongooseRepository(mongoClient.model('MinigameOverview'));
    const minigameOverviewService = (
      new MinigameOverviewService({ minigameOverviewRepository, context })
    );

    context.log.info('Getting MinigameOverview Results...');

    const results = (
      await minigameOverviewService
        .getMinigameOverview(req.query, req.headers['game-token'])
    );

    context.res = {
      status: 200,
      body: createBaseResponse(true, true, infoMessages.SUCCESSFULLY_REQUEST, results),
    };
  } catch (err) {
    context.log(`An unexpected error has happened. InvocationId: ${context.invocationId}`);
    context.res = {
      status: 500,
      body: createBaseResponse(false, true, errorMessages.DEFAULT_ERROR, null),
    };
  }

  context.done();
};
