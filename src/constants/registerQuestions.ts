export const registerQuestions = [
    {
        question: "What's your age? Please respond with only the number.",
        keyword: 'Age',
        options: [
            { num: '1', option: '13-18' },
            { num: '2', option: '19-24' },
            { num: '3', option: '25-30' },
            { num: '4', option: '30+' }
        ],
        response: ''
    },
    {
        question: "What's your gender? Please respond with only the number.",
        keyword: 'Gender',
        options: [
            { num: '1', option: 'Male' },
            { num: '2', option: 'Female' },
            { num: '3', option: 'Genderfluid' },
            { num: '4', option: 'Non-Binary' },
            { num: '5', option: 'MtF' },
            { num: '6', option: 'FtM' },
            { num: '7', option: 'Other' }
        ],
        response: ''
    },
    {
        question: "What's your sexuality? Please respond with only the number.",
        keyword: 'Sexuality',
        options: [
            { num: '1', option: 'Straight' },
            { num: '2', option: 'Gay' },
            { num: '3', option: 'Lesbian' },
            { num: '4', option: 'Bisexual' },
            { num: '5', option: 'Pansexual' },
            { num: '6', option: 'Asexual' },
            { num: '7', option: 'Other' }
        ],
        response: ''
    },
    {
        question: 'What country do you live in? Please respond only with your country.',
        keyword: 'Country',
        options: [],
        response: ''
    },
    {
        question: 'What languages do you speak? Please respond only with your languages.',
        keyword: 'Languages',
        options: [],
        response: ''
    },
    {
        question: 'What things do you like? This can be anything, hobbies, food, etc.',
        keyword: 'Likes',
        options: [],
        response: ''
    },
    {
        question: 'What things do you dislike?',
        keyword: 'Dislikes',
        options: [],
        response: ''
    }
];
