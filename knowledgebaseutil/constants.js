let prevDocument = {};

function updatePrevious(content) {
    prevDocument = content;
}

module.exports = {
    token: "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJvcmdJZCI6ImE1MzllNTM2LTQ0ZDAtNGIyYy1iNDAwLTY3ZDAzMGI5YzE5NCIsImV4cCI6MTU3MTU4NzI5MywiaWF0IjoxNTcxNTgzNjkzfQ.WLuOgKcugXUnNHq7YJ1zQ8k4PQ6dS5A9iT5mo5kX7ac",
    pythonKbid: "5fc006cc-edf7-4e8d-8736-68a176833a63",
    jsKbid: "1d761b87-a4b3-466d-a36f-0c96c45afacb",
    langCode: "en-US",
    orgId: "a539e536-44d0-4b2c-b400-67d030b9c194",
    baseUrl: "https://api.genesysappliedresearch.com/v2/knowledge",
    prevDocument,
    updatePrevious
};
