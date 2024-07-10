const fs = require("fs");
const fetch = require("node-fetch");

module.exports = (credentials) => {
  const { clientId, clientSecret } = credentials;
  const tokenPath = ".token-cache.json";

  // Check if token is cached not expired
  if (fs.existsSync(tokenPath)) {
    const cachedToken = JSON.parse(fs.readFileSync(tokenPath, "utf8"));
    if (new Date().getTime() < cachedToken.expiry) {
      return cachedToken.access_token;
    }
  }

  if (!clientSecret) {
    throw new Error("Missing client secret.");
  }

  // Fetch new token
  const params = {
    grant_type: "client_credentials",
    client_id: clientId,
    client_secret: clientSecret,
    scope: [
      "reactor_approver",
      "reactor_publisher",
      "assurance_read_plugins",
      "reactor_developer",
      "assurance_read_annotations",
      "openid",
      "session",
      "AdobeID",
      "read_organizations",
      "reactor_extension_developer",
      "assurance_read_events",
      "additional_info.job_function",
      "assurance_manage_sessions",
      "reactor_it_admin",
      "assurance_read_session_annotations",
      "reactor_admin",
      "additional_info.roles",
      "additional_info.projectedProductContext",
      "assurance_read_clients",
    ].join(","),
  };

  const formBody = Object.keys(params)
    .map(
      (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
    )
    .join("&");

  return fetch("https://ims-na1.adobelogin.com/ims/token/v3", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formBody,
  })
    .then((response) => response.json())
    .then((data) => {
      // Calculate expiry time (current time + expires_in seconds - 2 hour buffer)
      const expiry = new Date().getTime() + (data.expires_in - 7200) * 1000;
      const accessToken = data.access_token;
      // Cache the token
      fs.writeFileSync(
        tokenPath,
        JSON.stringify({ access_token: accessToken, expiry }),
        "utf8",
      );
      return accessToken;
    });
};
