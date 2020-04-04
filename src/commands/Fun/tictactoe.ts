import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import ttt from 'tictactoejs';
import { wrongSyntax } from '../../utils/Util';

const callback = async (message: Message, _args: string[]) => {
    const game = new ttt.TicTacToe();
    const board = await message.channel.send(
        '```' +
            game.ascii() +
            '\n\nX is the Player, O the bot.\nTo make a move, simply type [rowNumber] [lineNumber] counting from the bottom left corner.\nThe bottom-right corner would be "3 1", the top right one "3 3".\nSend [q]uit, [c]ancel or [s]top to end the game.```'
    );
    const collector = message.channel.createMessageCollector(msg => msg.author === message.author, { time: 1000 * 60 * 5 });
    collector.on('collect', msg => {
        if (['stop', 's', 'quit', 'q', 'cancel', 'c'].includes(msg.content.toLowerCase())) {
            collector.stop();
            msg.delete();
            board.delete();
            return wrongSyntax(message, 'Cancelled the game!');
        }
        const [x, y] = msg.content.split(' ');
        if (!game.legalMoves().some((ele: any) => ele.x === (x | 0) && ele.y === (y | 0))) return wrongSyntax(msg, 'Invalid move!');

        if (game.status() === 'in progress') {
            game.turn();
            game.move(x, y);
        }

        if (game.status() === 'in progress') {
            game.turn();
            game.randomMove();
        }
        msg.delete();
        if (game.status() === 'in progress')
            return board.edit(
                '```' +
                    game.ascii() +
                    '\n\nX is the Player, O the bot.\nTo make a move, simply type [rowNumber] [lineNumber] counting from the bottom left corner.\nThe bottom-right corner would be "3 1", the top right one "3 3".\nSend [q]uit, [c]ancel or [s]top to end the game.```'
            );
        if (game.status() === 'draw') board.edit('```' + game.ascii() + '\n\nDRAW!```');
        if (game.status() === 'X') board.edit('```' + game.ascii() + '\n\nPLAYER WINS!```');
        if (game.status() === 'O') board.edit('```' + game.ascii() + '\n\nBOT WINS!```');
        return collector.stop();
    });
};

export const command: Command = {
    name: 'tictactoe',
    category: 'FUN',
    aliases: ['ttt'],
    description: 'Play a game of TicTacToe against the bot!',
    usage: '',
    developerOnly: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    modOnly: false,
    adminOnly: false,
    callback: callback
};
