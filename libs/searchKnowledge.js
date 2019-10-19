const request = require('request-promise');

const options = { method: 'POST',
  url: 'https://api.genesysappliedresearch.com/v2/knowledge/knowledgebases/3d0f572e-34c7-4825-aa0f-c16af3611ce6/search',
  headers: 
   {
     token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6IjE4ZWNmOTEzLTI1OWUtNDk0Zi1iYWVjLTkwNTFmZjdkMmQ1OSIsImV4cCI6MTU3MTUyMjY4OSwiaWF0IjoxNTcxNTE5MDg5fQ.xrbHVvMsiUE1354s5l_o7xfHMViyFCB9hTZ_yJSYrxU',
     organizationid: '18ecf913-259e-494f-baec-9051ff7d2d59',
     'Content-Type': 'application/json' },
  body: 
   { query: 'Why did my account get locked?',
     pageSize: 5,
     pageNumber: 1,
     sortOrder: 'string',
     sortBy: 'string',
     languageCode: 'en-US',
     documentType: 'Faq' },
  json: true };

// request(options, function (error, response, body) {
//   if (error) throw new Error(error);

//   console.log(body);
// });

async function search() {
    const response = await request(options);
    console.log(response)
}
module.exports = {
    search
};