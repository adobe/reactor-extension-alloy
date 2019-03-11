
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
    return (async (search) => {
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
    token = '...';
    return new DevelopmentApi(
      new Api('https://analytics.adobe.io', 'Activation-DTM', token)
    );
  }
  return new Api('https://analytics.adobe.io', 'Activation-DTM', token);
};
