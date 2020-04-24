import { VenusCommand, VenusCommandStrings, VenusMessage } from '../../interfaces/Client';
import { wrongSyntax } from '../../utils/Util';
import { getMember } from '../../utils/getters';
import { isMemberHigher } from '../../utils/checks';
import { createInfraction } from '../../database/schemas/InfractionSchema';
import { logInfraction } from '../../utils/moderation';

const callback = async (message: VenusMessage, args: string[], strings: VenusCommandStrings) => {
    if (!message.guild) return;

    const member = await getMember(message, args, 0);
    if (!member) return;

    if (!isMemberHigher(message.member!, member)) return wrongSyntax(message, strings.NOT_HIGHER);

    const reason = args.length > 1 ? args.splice(1).join(' ') : strings.NO_REASON;

    const infraction = await createInfraction(message, member.user.id, 'warn', reason);
    return logInfraction(message, member, infraction, strings);
};

export const command: VenusCommand = {
    name: 'warn',
    category: 'MODERATION',
    aliases: [],
    developerOnly: false,
    requiresArgs: 1,
    nsfw: false,
    guildOnly: true,
    dmOnly: false,
    userPermissions: 'MANAGE_MESSAGES',
    botPermissions: '',
    callback: callback
};
