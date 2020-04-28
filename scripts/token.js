const auth = require("@adobe/jwt-auth");
const adobeIOClientCredentials = require("../test/functional/helpers/adobeIOClientCredentials");

(async () => {
  if (adobeIOClientCredentials) {
    console.log(adobeIOClientCredentials.orgId);
    result = await auth(adobeIOClientCredentials);
    console.log(result.access_token);
  }
})();