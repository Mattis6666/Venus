import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import CommandStrings from '../../interfaces/CommandStrings';
import Minesweeper from 'discord.js-minesweeper';
import { wrongSyntax } from '../../utils/Util';

const callback = (message: Message, args: string[], strings: CommandStrings) => {
    const [cols, rows, mines] = args.map(x => parseInt(x));

    let game = new Minesweeper({ columns: cols || 10, rows: rows || 10, mines: mines || 10, revealFirstCell: true }).start();
    if (!game) return;
    game = `${mines || 10} 💣\n${game}`;
    if (game.length > 2000) return wrongSyntax(message, strings.TOO_LONG);

    return message.channel.send(game);
};

export const command: Command = {
    name: 'minesweeper',
    category: 'FUN',
    aliases: ['mines'],
    description: 'Play a round of minesweeper',
    extended:
        'The purpose of the game is to open all the cells of the board which do not contain a bomb. You lose if you set off a bomb cell. \nEvery non-bomb cell you open will tell you the total number of bombs in the eight neighboring cells..',
    usage: '[columns] [rows] [mines]',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
