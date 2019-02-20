
class Api {
    constructor(baseUrl, apiKey, token) {
        this.baseUrl = baseUrl;
        this.apiKey = apiKey;
        this.token = token;
    }

    async rsidCompletionFunction(globalCompanyId) {
        console.log("rsid Completion function called");
        var rsidCachePrefix = "";
        var rsidCache = null;
        const headers = {
                method: "GET",
                headers: {
                    "x-api-key": apiKey,
                    "x-proxy-global-company-id": globalCompanyId,
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            };
        const url = baseUrl + "/api/" + globalCompanyId + "/collections/suites";
        return search => {
            console.log("rsidCompletion", search, rsidCachePrefix);
            if (rsidCache != null && search.startsWith(rsidCachePrefix)) {
                console.log("Using Cache!", search, rsidCachePrefix);
                return rsidCache.filter(rsid => rsid.value.toLowerCase().indexOf(search.toLowerCase()) !== -1);
            }
            const response = await fetch(url + "?rsidContains=" + search + "&limit=100", headers);
            const rsids = await response.json();
            const rsidNames = rsids.content.map(rsObj => ({label: rsObj.rsid, value: rsObj.rsid}));
            if (rsids.totalPages === 1) {
                console.log("Caching rsids", rsidNames)
                rsidCache = rsidNames;
                rsidCachePrefix = search;
            }
            console.log(rsidNames);
            return rsidNames;
        }
    }

    async companies(imsOrgId) {
        const response = await fetch(this.baseUrl + "/discovery/me",
        {
            method: "GET",
            headers: {
                "x-api-key": this.apiKey,
                "Authorization": "Bearer " + this.token,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        });
        const responseJson = await response.json();
        const matchingOrg = responseJson.imsOrgs.find(org => org.ismOrgId === this.imsOrgId);
        if (matchingOrg === undefined) {
            return [];
        }
        return matchingOrg.companies;
    }
    
}

class DevelopmentApi {
    constructor(api) {
        this.api = api;
    }
    
    async rsidCompletionFunction(globalCompanyId) {
        return this.api.rsidCompletionFunction(globalCompanyId);
    }

    async companies(imsOrgId) {
        return this.api.companies("4D6D0DA3528CDEFD0A490D45@AdobeOrg");
    }

}

export default AnalyticsApi = token => {
    if (token === "X34DF56GHHBBFFGH") {
        token = "eyJ4NXUiOiJpbXNfbmExLWtleS0xLmNlciIsImFsZyI6IlJTMjU2In0.eyJpZCI6IjE1NTAwNzc2ODI1MTJfMDViYWFjZTEtOWE2Yi00ZmQ1LTkyOGUtM2U2MmQ0MDI1MWE4X3VlMSIsImNsaWVudF9pZCI6IkFjdGl2YXRpb24tRFRNIiwidXNlcl9pZCI6IkZCQTA2MEU3NEY5ODNGQUUwQTQ5MEQ0Q0BBZG9iZUlEIiwic3RhdGUiOiJ7XCJzZXNzaW9uXCI6XCJodHRwczovL2ltcy1uYTEuYWRvYmVsb2dpbi5jb20vaW1zL3Nlc3Npb24vdjEvWkdRMlpUZzFNRGN0TkRjMlpDMDBOVGRtTFRnMk56VXRZVE14TnpFNU1XWmxNelZtTFMxR1FrRXdOakJGTnpSR09UZ3pSa0ZGTUVFME9UQkVORU5BUVdSdlltVkpSQVwifSIsInR5cGUiOiJhY2Nlc3NfdG9rZW4iLCJhcyI6Imltcy1uYTEiLCJmZyI6IlRGWldKUzZHWFBQMzc3NzcyNjVRQ0FBQUQ0PT09PT09Iiwic2lkIjoiMTU1MDA3NzY4MjUxNF82NTI2MGI0Mi0yOGQ2LTQ2ZmMtOTZiYy1iNTdlYmY5YTk1MWRfdWUxIiwibW9pIjoiM2ZmM2E5MGIiLCJjIjoiM1RmQkYzTE5oTTlaWXFvYlI3Y0x2QT09IiwiZXhwaXJlc19pbiI6Ijg2NDAwMDAwIiwiY3JlYXRlZF9hdCI6IjE1NTAwNzc2ODI1MTIiLCJzY29wZSI6Im9wZW5pZCxBZG9iZUlELHNlc3Npb24scmVhZF9vcmdhbml6YXRpb25zLGFkZGl0aW9uYWxfaW5mby5wcm9qZWN0ZWRQcm9kdWN0Q29udGV4dCxhZGRpdGlvbmFsX2luZm8uam9iX2Z1bmN0aW9uLGFkZGl0aW9uYWxfaW5mby5yb2xlcyJ9.CsXqyuE3jKEfIBBQnsFB_ZyOqnz9I2pUWCidWbgsa45BCI0naujvpiQzm5Y7fRahLPFM3fr4949DpkBifJmT3vQLQhZ49ezyouMj08f4NVLHM4Di9g_iwCCVlcYj8d4MBhSn1LxDYmFY4YpGwCn4XbQVkaJIGC6EJoZvRvpVEkbdTOP4QKCcXxTV0Ms_iWvjF9l9uucebfuJqqgs3NbEZsAypLvlGWE0uSWy-MmB2m8fLU1KBrEMXnx4HMu9K0GjhowgTUwtoUaxc-M__1LDzySufOX4KZR5usqHvQJjR0p1CpsmigLcXau2Vfunl49iOQGNXetcGk7a14dSX5TKGQ";
        return new DevelopmentApi(
            new Api("https://analytics.adobe.io", "Activation-DTM", token)
        );
    }
    return new Api("https://analytics.adobe.io", "Activation-DTM", token)
}
