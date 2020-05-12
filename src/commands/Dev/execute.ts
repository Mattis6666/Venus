import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { exec } from 'child_process';
import { uploadHaste } from '../../utils/hastebin';

const callback = async (message: VenusMessage, args: string[], _strings: VenusCommandStrings) => {
    exec(args.join(' '), async (err, stdout, stderr) => {
        if (err) message.channel.send(await sendLongText(err.stack!), { code: 'xl' });
        if (stderr) message.channel.send(await sendLongText(stderr), { code: 'xl' });
        return message.channel.send((await sendLongText(stdout)) || 'No output!', { code: 'xl' });
    });
};

export const command: VenusCommand = {
    name: 'execute',
    category: 'DEVELOPMENT',
    aliases: ['exec', 'exe', 'exc'],
    developerOnly: true,
    nsfw: false,
    guildOnly: false,
    dmOnly: false,
    requiresArgs: 0,
    userPermissions: '',
    botPermissions: '',
    callback: callback
};

const sendLongText = async (text: string) => (text.length > 2000 ? await uploadHaste(text) : text);
