import md5 from 'blueimp-md5';

export function getAvatar(email) {
    if (!email) return 'https://www.gravatar.com/avatar/?d=mp';
    const hash = md5(email.trim().toLowerCase());
    return `https://www.gravatar.com/avatar/${hash}?d=identicon`;
}
