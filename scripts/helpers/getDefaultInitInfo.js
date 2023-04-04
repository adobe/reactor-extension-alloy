const auth = require("@adobe/jwt-auth");
const adobeIOClientCredentials = require("../../test/functional/helpers/adobeIOClientCredentials");

let token;
let renewAfter;
const getAccessToken = async () => {
  if (!token || Date.now() > renewAfter) {
    token = await auth(adobeIOClientCredentials);
    // Renew the token 1 hour before it expires.
    renewAfter = Date.now() + token.expires_in - 60 * 60 * 1000;
  }
  return token.access_token;
};

module.exports = async ({ info, type }) => {
  if (adobeIOClientCredentials) {
    info.company.orgId = adobeIOClientCredentials.orgId;
    info.tokens.imsAccess = await getAccessToken();
  }

  if (type === "actions") {
    info.extensionSettings = {
      instances: [
        {
          name: "alloy1"
        },
        {
          name: "alloy2"
        }
      ]
    };
  }
  return info;
};
