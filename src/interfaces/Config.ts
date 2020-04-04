export default interface Config {
    token: string;
    mongoString: string;
    defaultPrefix: string;
    developers: string[];
    infoChannel: string;
    errorChannel: string;
    imageChannel: string;
    apiKeys: {
        imgur: {
            id: string;
            secret: string;
        };
    };
}
