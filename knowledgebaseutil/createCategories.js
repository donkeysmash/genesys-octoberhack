const request = require("request");
const constants = require('./constants');


function postCategory(name, description) {
    const options = {
        method: 'POST',
        url: `${constants.baseUrl}/knowledgebases/${constants.kbid}/languages/en-US/categories/`,
        headers:
        {
            'cache-control': 'no-cache',
            'Accept-Encoding': 'gzip, deflate',
            Host: 'api.genesysappliedresearch.com',
            token: `${constants.token}`,
            organizationid: `${constants.orgId}`,
            'Content-Type': 'application/json'
        },
        body: { name: 'Attraction', description: 'Attraction Category' },
        json: true
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log(body);
    });

}
