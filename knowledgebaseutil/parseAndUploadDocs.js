const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const constants = require('./constants');


function parseText(path) {
    const txt = fs.readFileSync(path, {encoding: 'utf-8'});
    const lines = txt.split('------------');
    const body = [];
    for (let line of lines) {

        let [question, alternatives, answer, externalUrl] = line.split('\t');
        const moreQuestions = alternatives.split(';').filter(x => x.length > 0).map(x => x.trim());
        question = question.trim();
        answer = answer.replace(/\n/g, '<newline>');

        const documentToSend = {
            type: 'faq',
            faq: {
                question,
                answer,
                alternatives: moreQuestions
            },
            externalUrl
        };
       body.push(documentToSend);
    };

    return body;
}

// let body = parseText('./python_source.txt');
// let options = {
//     method: 'PATCH',
//     url: `${constants.baseUrl}/knowledgebases/${constants.pythonKbid}/languages/${constants.langCode}/documents`,
//     headers: {
//         token: constants.token,
//         organizationid: constants.orgId,
//         'Content-Type': 'application/json'
//     },
//     body,
//     json: true
// };

// request(options, function (err, res, body) {
//     if (err) throw new Error(err);
//     fs.writeFileSync('./pythonDocUploadResult.json', JSON.stringify(body, null, 4));
// });

body = parseText('./javascript_source.txt');
options = {
    method: 'PATCH',
    url: `${constants.baseUrl}/knowledgebases/${constants.jsKbid}/languages/${constants.langCode}/documents`,
    headers: {
        token: constants.token,
        organizationid: constants.orgId,
        'Content-Type': 'application/json'
    },
    body,
    json: true
};

request(options, function (err, res, body) {
    if (err) throw new Error(err);

    fs.writeFileSync('./javascriptDocUploadResult.json', JSON.stringify(body, null, 4));
});




