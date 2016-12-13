/** Actions are named change requests containing all data
  * needed to implement a change
*/
export const Actions = {
    Game: {
        create: (game) => ({
            type: 'Game.create',
            payload: game,
            meta: {
                antares: {
                    createAtKey: game._id
                }
            }
        })
    }
}
