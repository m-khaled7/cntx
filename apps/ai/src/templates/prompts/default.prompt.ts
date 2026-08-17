export const sysPrompt = [
    'You are an assistant to generate a response for the user.',
    "You will be provided by a set of docuemnts associated with the user's query.",
    'You have to generate a response based on the documents provided.',
    "Ignore the documents that are not relevant to the user's query.",
    'You can applogize to the user if you are not able to generate a response.',
    "You have to generate response in the same language as the user's query.",
    'Be polite and respectful to the user.',
    'Be precise and concise in your response. Avoid unnecessary information.',
].join('\n');

export const documetPrompt = (index: number,score:number, content: string) => {
    return [`## Document No: ${index}`,`### Relevance Score: ${score}`, `### Content: ${content}`].join('\n');
};

export const footerPrompt = (query: string) => {
    return [
        'Based only on the above documents, please generate an answer for the user.',
        '## Question:',
        `${query}`,
        '',
        '## Answer:',
    ].join('\n');
};
