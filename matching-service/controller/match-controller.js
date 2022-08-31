import { ormCreateMatch as _createMatch } from '../model/match-orm.js'

export async function createMatch(req, res) {
    try {
        const { username, difficulty } = req.body;
        if (username && difficulty) {
            const resp = await _createMatch(req.body);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new match!'});
            } else {
                console.log(`Created new match for ${username} successfully!`)
                return res.status(201).json({message: `Created new match for ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Difficulty are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new match!'})
    }
}
