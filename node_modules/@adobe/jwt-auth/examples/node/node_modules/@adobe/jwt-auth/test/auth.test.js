const auth = require('../index');

const clientId = '9x4f87e5xxxf46x68f68x46ee6ef2738';
const clientSecret = 'f39b8de7-35f5-4fc3-8615-f0561214x27d';
const technicalAccountId = '53D840225B758DD00X495D9B@techacct.adobe.com';
const orgId = 'C74F69D7594880280X495D09@AdobeOrg';
const metaScopes = ['ent_dataservices_sdk'];
const privateKey = 'aalsdjfajsldjfalsjkdfa;lsjf;aljs';

describe('Validate input', () => {
  test('all parameters missing', () => {
    expect.assertions(1);
    return expect(auth({})).rejects.toThrow();
  });
  test('missing clientId', () => {
    expect.assertions(1);
    return expect(
      auth({ clientSecret, technicalAccountId, orgId, metaScopes, privateKey })
    ).rejects.toThrow();
  });
  test('missing clientSecret', () => {
    expect.assertions(1);
    return expect(
      auth({ clientId, technicalAccountId, orgId, metaScopes, privateKey })
    ).rejects.toThrow();
  });
  test('missing technicalAccountId', () => {
    expect.assertions(1);
    return expect(
      auth({
        clientId,
        clientSecret,
        orgId,
        metaScopes,
        privateKey
      })
    ).rejects.toThrow();
  });
  test('missing orgId', () => {
    expect.assertions(1);
    return expect(
      auth({
        clientId,
        clientSecret,
        technicalAccountId,
        metaScopes,
        privateKey
      })
    ).rejects.toThrow();
  });
  test('missing metaScopes', () => {
    expect.assertions(1);
    return expect(
      auth({
        clientId,
        clientSecret,
        technicalAccountId,
        orgId,
        privateKey
      })
    ).rejects.toThrow();
  });
  test('missing privateKey', () => {
    expect.assertions(1);
    return expect(
      auth({
        clientId,
        clientSecret,
        technicalAccountId,
        orgId,
        metaScopes
      })
    ).rejects.toThrow();
  });
});

describe('Sign with invalid primary key', () => {
  test('invalid primary key', () => {
    expect.assertions(1);
    return expect(
      auth({
        clientId,
        clientSecret,
        technicalAccountId,
        orgId,
        metaScopes,
        privateKey
      })
    ).rejects.toThrow();
  });
});
