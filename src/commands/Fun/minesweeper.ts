import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import Minesweeper from 'discord.js-minesweeper';
import { wrongSyntax } from '../../utils/Util';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    const [cols, rows, mines] = args.map(x => parseInt(x));

    let game = new Minesweeper({
        columns: cols || 10,
        rows: rows || 10,
        mines: mines || 10,
        revealFirstCell: true
    }).start();
    if (!game) return;
    game = `${mines || 10} Gnomes <:GnomePeek:703000744714043452>\n${(game as string).replace(/:boom:/g, '<:gnome:702997891744268288>')}`;
    if (game.length > 2000) return wrongSyntax(message, strings.TOO_LONG);

    return message.channel.send(game);
};

export const command: VenusCommand = {
    name: 'gnomesweeper',
    category: 'FUN',
    aliases: ['minesweeper', 'gnomes', 'mines', 'gs', 'ms'],
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
