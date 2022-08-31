import { createMatch } from './repository.js';

export async function ormCreateMatch (username, difficulty) {
  try {
    await createMatch({username: username, difficulty: difficulty});
    return true;
  } catch (err) {
    console.log('ERROR: Could not create new match');
    return { err }
  }
}
