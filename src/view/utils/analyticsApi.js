import memoize from 'memoize-one';

class Api {
  constructor(baseUrl, apiKey, token) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.token = token;
  }

  rsidCompletionFunction(globalCompanyId) {
    let rsidCachePrefix = '';
    let rsidCache = null;
    const headers = {
      method: 'GET',
      headers: {
        'x-api-key': this.apiKey,
        'x-proxy-global-company-id': globalCompanyId,
        'Authorization': `Bearer ${this.token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    const url = `${this.baseUrl}/api/${globalCompanyId}/collections/suites`;
    return memoize(async (search) => {
      if (rsidCache != null && search.startsWith(rsidCachePrefix)) {
        return rsidCache.filter(rsid =>
          rsid.value.toLowerCase().indexOf(search.toLowerCase()) !== -1
        );
      }
      const response = await fetch(`${url}?rsidContains=${search}&limit=100`, headers);
      const rsids = await response.json();
      const rsidNames = rsids.content.map(rsObj => ({ label: rsObj.rsid, value: rsObj.rsid }));
      if (rsids.totalPages === 1) {
        rsidCache = rsidNames;
        rsidCachePrefix = search;
      }
      return rsidNames;
    });
  }

  async companies(imsOrgId) {
    const response = await fetch(`${this.baseUrl}/discovery/me`,
      {
        method: 'GET',
        headers: {
          'x-api-key': this.apiKey,
          'Authorization': `Bearer ${this.token}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
    const responseJson = await response.json();
    const matchingOrg = responseJson.imsOrgs.find(org => org.imsOrgId === imsOrgId);
    if (matchingOrg === undefined) {
      return [];
    }
    return matchingOrg.companies.map(company => ({
      label: company.companyName,
      value: company.globalCompanyId
    }));
  }
}

class DevelopmentApi {
  constructor(api) {
    this.api = api;
  }

  rsidCompletionFunction(globalCompanyId) {
    return this.api.rsidCompletionFunction(globalCompanyId);
  }
  async companies(imsOrgId) { // eslint-disable-line no-unused-vars
    // for testing, change this to an org you are a part of
    const companies = await this.api.companies('4D6D0DA3528CDEFD0A490D45@AdobeOrg');
    companies.push({ label: 'Bogus Company 1', value: 'bogusco1' });
    companies.push({ label: 'Bogus Company 2', value: 'bogusco2' });
    return companies;
  }

}

export default (token) => {
  // This is the sandbox token
  if (token === 'X34DF56GHHBBFFGH') {
    // go to launch.adobe.com, login, and then
    // in the console do "copy(userData.imsAccessToken)", paste that below for testing
    token = 'eyJ4NXUiOiJpbXNfbmExLWtleS0xLmNlciIsImFsZyI6IlJTMjU2In0.eyJpZCI6IjE1NTIzMzM4NTM4ODNfYmIyNTU0ZWYtMmY2Mi00YzBjLThlZmEtODU4NzZkYzE0NmM2X3VlMSIsImNsaWVudF9pZCI6IkFjdGl2YXRpb24tRFRNIiwidXNlcl9pZCI6IkZCQTA2MEU3NEY5ODNGQUUwQTQ5MEQ0Q0BBZG9iZUlEIiwic3RhdGUiOiJ7XCJzZXNzaW9uXCI6XCJodHRwczovL2ltcy1uYTEuYWRvYmVsb2dpbi5jb20vaW1zL3Nlc3Npb24vdjEvWkRkbE9XVm1NVEl0WVdFM09TMDBNbVl3TFdJeE5EWXRORGt4WVRKaU9EQTBOelprTFMxR1FrRXdOakJGTnpSR09UZ3pSa0ZGTUVFME9UQkVORU5BUVdSdlltVkpSQVwifSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJhcyI6Imltcy1uYTEiLCJmZyI6IlRJREVOUzZHWFBQMzc3NzcyNjVRT0FBQU1JPT09PT09Iiwic2lkIjoiMTU1MjMzMzg1Mzg4NV9iNTBmOTJiNS1lMjk2LTRmZGMtYWFhMi0wNmE3ZDUzMGVjNDdfdWUxIiwibW9pIjoiZjEzNGJjY2EiLCJjIjoiQi92TklYRzRUZG80N3NIR0xrdGdWZz09IiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwic2NvcGUiOiJvcGVuaWQsQWRvYmVJRCxzZXNzaW9uLHJlYWRfb3JnYW5pemF0aW9ucyxhZGRpdGlvbmFsX2luZm8ucHJvamVjdGVkUHJvZHVjdENvbnRleHQsYWRkaXRpb25hbF9pbmZvLmpvYl9mdW5jdGlvbixhZGRpdGlvbmFsX2luZm8ucm9sZXMiLCJjcmVhdGVkX2F0IjoiMTU1MjMzMzg1Mzg4MyJ9.KI5ZqNOTOVPpd8Ll0arNCaDUbNOesKwftMjZ6OKNt5xiTVJiqSbwXugHKOGKhZfLE3Bb3MkeBxH9ZnDdzDVVqRjQba_j_l1SNWT7ljg7rXwjSm544j5-Sq3aDJQcP6cWapGUCMjZJiPUMpQNyFt_QTcfo9jEJeVdpIZFRqTLCwWOevmNTwbkInliNjDcYjoH2-e8EPicJfpnyJLZg0w-xXkFy1yUPho0B3wmVh1tm_KoXGm5G4Z8eeaFJ074MMIcKZcGrOqdG17Yxmb_Smk8cbCsefFj6-1eFr9mSPfRDvTITKPH_voXDL9oewZN0g0XkkSMvxD4zH0Oo3P7xaTeXw';
    return new DevelopmentApi(
      new Api('https://analytics.adobe.io', 'Activation-DTM', token)
    );
  }
  return new Api('https://analytics.adobe.io', 'Activation-DTM', token);
};
