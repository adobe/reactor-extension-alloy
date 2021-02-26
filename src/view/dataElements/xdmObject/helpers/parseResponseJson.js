/**
 * Parses the JSON returned by a network request and returns an object that looks like a network request
 * Useful for post-fetch() operations where status and body payloads need to be evaluated at the same time
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON, status from the response
 */
export default response => {
  return response
    .json()
    .catch(() => {
      throw new Error("An unexpected response was received from the server.");
    })
    .then(body => {
      return {
        status: response.status,
        ok: response.ok,
        json() {
          return body;
        }
      };
    });
};
