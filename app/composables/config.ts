const config = {
    dataVersion: 3,

    githubUser: 'mr-calculator',
    githubRepo: 'mr-calculator.github.io',
    redditUser: 'mr-prof-calculator',
    twitterUser: 'mr_prof_calc',
    discordServer: 'https://discord.gg/xhZANY8nSb',
    email: 'mr-calculator.estimate510@slmails.com',
    domain: 'mr-calculator.github.io',
    domainHttp: 'https://mr-calculator.github.io'
};

export function useAbsoluteUrl(...components: string[]) {
    return config.domainHttp + '/' + components.map(c => trimFirst('/', trimLast('/', c))).join('/');
}
export function useCanonicalUrl(...components: string[]) {
    return config.domainHttp + '/' + components.map(c => trimFirst('/', trimLast('/', c))).join('/') + '/';
}

export default config;