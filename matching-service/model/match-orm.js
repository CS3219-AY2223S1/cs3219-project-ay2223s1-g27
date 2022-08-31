import { createMatch } from './repository.js';

export async function ormCreateMatch (params) {
  try {
    await createMatch(params);
    return true;
  } catch (err) {
    console.log('ERROR: Could not create new match');
    return { err }
  }
}
