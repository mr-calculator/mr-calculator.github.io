const config = {
    githubUser: 'mr-calculator',
    email: 'mr-calculator.estimate510@slmails.com',
    domain: 'mr-calculator.github.io',
    domainHttp: 'https://mr-calculator.github.io'
    // domain: 'localhost:3000',
    // domainHttp: 'http://localhost:3000'
};

export function useAbsoluteUrl(...components: string[]) {
    return config.domainHttp + '/' + components.map(c => trimFirst('/', trimLast('/', c))).join('/');
}

export default config;