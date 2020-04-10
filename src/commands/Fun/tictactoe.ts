import { Message } from 'discord.js';
import Command from '../../interfaces/Command';
import ttt from 'tictactoejs';
import { wrongSyntax, replace } from '../../utils/Util';
import CommandStrings from '../../interfaces/CommandStrings';

const callback = async (message: Message, _args: string[], strings: CommandStrings) => {
    const game = new ttt.TicTacToe();
    const board = await message.channel.send(`\`\`\`${game.ascii()}\n\n${replace(strings.RULES, { CANCEL_WORD: strings.CANCEL_WORD })}\`\`\``);
    const collector = message.channel.createMessageCollector(msg => msg.author === message.author, { time: 1000 * 60 * 5 });
    collector.on('collect', msg => {
        if (strings.CANCEL_WORD.toLowerCase().includes(msg.content.toLowerCase())) {
            collector.stop();
            msg.delete();
            board.delete();
            return wrongSyntax(message, strings.QUIT);
        }
        const [x, y] = msg.content.split(' ');
        if (!game.legalMoves().some(ele => ele.x === (x | 0) && ele.y === (y | 0))) return wrongSyntax(msg, strings.INVALID_MOVE);

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
            return board.edit(`\`\`\`${game.ascii()}\n\n${replace(strings.RULES, { CANCEL_WORD: strings.CANCEL_WORD })}\`\`\``);

        if (game.status() === 'draw') board.edit(`\`\`\`${game.ascii()}\n\n${strings.DRAW}\`\`\``);

        if (game.status() === 'X')
            board.edit(
                `\`\`\`${game.ascii()}\n\n${replace(strings.WIN, {
                    PLAYER: message.member?.displayName || message.client.user!.username
                })}\`\`\``
            );

        if (game.status() === 'O')
            board.edit(
                `\`\`\`${game.ascii()}\n\n${replace(strings.LOSS, {
                    BOT: message.guild?.me?.displayName || message.client.user!.username
                })}\`\`\``
            );
        return collector.stop();
    });
};

export const command: Command = {
    name: 'tictactoe',
    category: 'FUN',
    aliases: ['ttt'],
    description: 'Play a game of TicTacToe against the bot!',
    extended: '',
    usage: '',
    developerOnly: false,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};
