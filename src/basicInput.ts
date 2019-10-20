import { window } from 'vscode';

/**
 * Shows a pick list using window.showQuickPick().
 */
export async function showQuickPick() {
	let i = 0;
	const result = await window.showQuickPick(['eins', 'zwei', 'drei'], {
		placeHolder: 'eins, zwei or drei',
		onDidSelectItem: item => window.showInformationMessage(`Focus ${++i}: ${item}`)
	});
	window.showInformationMessage(`Got: ${result}`);
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

    const { code, answer, externalUrl } = await mockAnswer(question, languageCode);
    let result: { selectedGoogleGod: boolean, contents: string } = {
        selectedGoogleGod: false,
        contents: 'nothing was here'
    };
    await window.showInformationMessage(answer, {modal: false});
    await window.showQuickPick(['code snippet', 'Help me Google god'], {
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