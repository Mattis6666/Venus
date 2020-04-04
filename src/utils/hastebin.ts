import { fetch } from './Util';

export const uploadHaste = async (text: string) => {
    const result = await fetch('https://hasteb.in/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain' },
        body: text,
        redirect: 'follow'
    });
    return result ? `https://hasteb.in/${result.key}` : 'Failed to upload to hastebin!';
};
