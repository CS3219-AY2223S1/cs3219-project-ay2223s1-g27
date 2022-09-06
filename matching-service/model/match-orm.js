import { createMatch, deleteMatch, findOneMatch } from './repository.js';
import { Op } from 'sequelize'

async function ormCreateMatch(username, socketId, difficulty) {
  try {
    const deleteCondition = {
      where: {
        username: {
          [Op.eq]: username
        }
      }
    }
    await deleteMatch(deleteCondition);
    await createMatch({
      username: username, socket_id: socketId,
      difficulty: difficulty, createdAt: Date.now()
    });
    return true;
  } catch (err) {
    console.log(`ERROR: Could not create new match; err=${err}`);
    return { err }
  }
}

async function ormFindMatch(username, difficulty, since) {
  try {
    const condition = {
      where: {
        username: {
          [Op.ne]: username
        },
        difficulty: difficulty,
        createdAt: {
          [Op.gte]: since
        }
      },
      order: [['createdAt']]
    }
    const match = await findOneMatch(condition);
    return match;
  } catch (err) {
    console.log(`ERROR: Could not find pending match; err=${err}`);
    return { err }
  }
}

async function ormDeleteMatchBySocketId(socketId) {
  try {
    const condition = {
      where: {
        socket_id: {
          [Op.eq]: socketId
        }
      }
    }
    await deleteMatch(condition);
    return true;
  } catch (err) {
    console.log(`ERROR: Could not delete match; err=${err}`);
    return { err };
  }
}

async function ormDeleteOutdatedMatch(before) {
  try {
    const condition = {
      where: {
        createdAt: {
          [Op.lte]: before
        }
      }
    }
    await deleteMatch(condition);
    return true;
  } catch (err) {
    console.log(`ERROR: Could not delete outdated matches; err=${err}`);
    return { err };
  }
}

export {
  ormCreateMatch,
  ormDeleteMatchBySocketId,
  ormDeleteOutdatedMatch,
  ormFindMatch,
}
