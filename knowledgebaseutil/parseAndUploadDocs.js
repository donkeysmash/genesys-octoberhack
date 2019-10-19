const _ = require('lodash');
const fs = require('fs');
const request = require('request');
const constants = require('./constants');


function parseText(path) {
    const txt = fs.readFileSync(path, {encoding: 'utf-8'});

    const categoryMapping = JSON.parse(fs.readFileSync('./categoryMapping.json', {encoding: 'utf-8'}));

    const lines = txt.split('\n');

    const body = [];
    for (let line of lines) {
        const [category, question, answer, externalUrl, alternatives] = line.split('\t');
        const moreQuestions = alternatives.split(';');

        const documentToSend = {
            type: 'faq',
            faq: {
                question,
                answer,
                alternatives: moreQuestions
            },
            categories: [{ id: categoryMapping[category] }],
            externalUrl
        };
       body.push(documentToSend);
    };

    return body;
}

const body = parseText('./basic_source.txt');
const options = {
    method: 'PATCH',
    url: `${constants.baseUrl}/knowledgebases/${constants.kbid}/languages/${constants.langCode}/documents`,
    headers: {
        'Postman-Token': 'e5eea134-7c1b-4fd2-a588-8e7ce99d4f61',
        'cache-control': 'no-cache',
        token: constants.token,
        organizationid: constants.orgId,
        'Content-Type': 'application/json'
    },
    body,
    json: true
};

request(options, function (err, res, body) {
    if (err) throw new Error(err);

    fs.writeFileSync('./uploadedDocuments.json', JSON.stringify(body, null, 4));
});




