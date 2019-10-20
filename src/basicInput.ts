import { window } from 'vscode';
import * as rp from 'request-promise';
const constants: any = require('../knowledgebaseutil/constants');

export async function updateKnowledge(selected: string, langCode: string): Promise<any> {
    const options = {
        headers: {
            Accept: '*/*',
            token: constants.token,
            organizationid: constants.orgId,
            'Content-Type': 'application/json'
        },
        body: {
            type: 'faq',
            faq: {
                question: "question",
                answer: selected
            },
            externalUrl: `https://stackoverflow.com/search?q=${selected}`
        },
        json: true
    }
    const kbid = langCode === 'python' ? constants.pythonKbid : constants.jsKbid;
    const url = `${constants.baseUrl}/knowledgebases/${kbid}/languages/${constants.langCode}/documents/`
    const {results} = await rp.post(url, options);
    return results || '';
}
/**
 * Shows an input box using window.showInputBox().
 */
export async function showInputBox(selected: string): Promise<string> {
    const result = await window.showInputBox({
        value: selected,
        valueSelection: [0, selected.length],
        placeHolder: 'Enter your question'
    });

    return result || '';
}

export async function showResultBox(question: string, languageCode: string): Promise<{ selectedGoogleGod: boolean, contents: string }> {

    const { code, answer, externalUrl } = await getAnswer(question, languageCode);
    let result: { selectedGoogleGod: boolean, contents: string } = {
        selectedGoogleGod: false,
        contents: 'nothing was here'
    };
    if (answer.length > 0) {
        await window.showInformationMessage(answer, { modal: true });
    }

    let quickPick = ['code snippet', 'Help me Google god'];
    if (code === 'gotogooglegod') quickPick = ['Help me Google god'];

    await window.showQuickPick(quickPick, {
        onDidSelectItem: item => {
            if (item === 'code snippet') {
                result.contents = code;
                result.selectedGoogleGod = false;
            } else if (item === 'Help me Google god') {
                result.selectedGoogleGod = true;
                result.contents = externalUrl;
            }
        }
    });

    return result;
}


async function getAnswer(question: string, langCode: string):
Promise<{ code: string, answer: string, externalUrl: string }>
{
    const options = {
        headers: {
            Accept: '*/*',
            token: constants.token,
            organizationid: constants.orgId,
            'Content-Type': 'application/json'
        },
        body: {
            query: question,
            pageSize: 5,
            pageNumber: 1,
            sortOrder: 'string',
            sortBy: 'string',
            languageCode: 'en-US',
            documentType: 'Faq'
        },
        json: true
    }
    const kbid = langCode === 'python' ? constants.pythonKbid : constants.jsKbid;
    const url = `${constants.baseUrl}/knowledgebases/${kbid}/search`
    const {results} = await rp.post(url, options);
    if (results.length > 0) {
        constants.updatePrevious(results[0]);
        const rawAnswer: string = results[0].faq.answer;
        const externalUrl = results[0].externalUrl.replace("\n", "");
        const [junkCodeWithJunk, answerWithJunk] = rawAnswer.split('</code>');
        const [preAnswerWithJunk, codeWithJunk ] = junkCodeWithJunk.split('<code>');
        const code = codeWithJunk.replace('<code>', '').replace('"', '').replace(/\<newline\>/g, '\n').replace(/\"\"/g, '"').replace(/;/g, ';\n').replace(/{/g, '{\n').replace(/}/g, '}\n');
        const preAnswer = preAnswerWithJunk.replace(/\"/g, '').replace(/\<newline\>/g, '\n');
        const answer = preAnswer + answerWithJunk.replace(/\"/g, '').replace(/\<newline\>/g, '\n');

        return {
            externalUrl,
            code,
            answer
        };
    } else {
        const replacedQuestion = `${question.trim()} in ${langCode}`.replace(/ /g, '+');
        const externalUrl = `https://google.com/search?q=${replacedQuestion}`;
        const answer = '';
        const code = 'gotogooglegod';
        return {
            externalUrl,
            code,
            answer
        };
    }
}


async function mockAnswer(question: string, languageCode: string): Promise<{ code: string, answer: string, externalUrl: string }> {
    const code = `
            const request = require('request')

            request.post('https://flaviocopes.com/todos', {
            json: {
                todo: 'Buy the milk'
            }
            }, (error, res, body) => {
            if (error) {
                console.error(error);
                return;
            }
            console.log(\`statusCode: \$\{res.statusCode}\`);
            console.log(body);
            });
    `

    const answer = `There are many ways to perform an HTTP POST request in Node, depending on the abstraction level you want to use. The simplest way to perform an HTTP request using Node is to use the Request library`;

    const replacedQuestion = ` ${question.trim()}`.replace(/ /g, '+');
    const languageTag = encodeURIComponent(`[${languageCode}]`);
    const questionToAsk = `${languageTag}${replacedQuestion}`;


    const externalUrl = `https://stackoverflow.com/search?q=${questionToAsk}`;
    return {
        code,
        answer,
        externalUrl
    };
}