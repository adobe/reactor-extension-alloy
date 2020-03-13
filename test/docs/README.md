# Test Instructions

Please see the [README](../../README.md) for descriptions of the various test scripts that are available for use.

## Manually Testing Views Using The Local Sandbox

### Running Views Dependent Upon Extension Settings
When running `npm run dev`, a local sandbox will be provided where you can manually test extension views in isolation. For this extension, many views are dependent upon settings coming from the extension configuration view in order to function properly.

For illustration purposes, let's assume we are testing the Send Event action type. In the sandbox, we first need to select the "Extension Configuration" view. In that view, configure whatever instances you would like to test with. When you're done, click the Get Settings tab on the right side of the sandbox, then click the Get Settings button. You should be provided with a block of JSON that looks something like this:

```json
{
  "instances": [
    {
      "name": "alloy",
      "configId": "PR123",
      "idSyncContainerId": 10
    }
  ]
}
```

Copy this JSON. Now, switch to the "Send Event" action view. You may see an error. That's expected, because it doesn't have extension settings (the settings that contain the configured instances) to work with yet since the view is being tested in isolation. It does not reflect how the extension will actually behave inside Launch, however, because inside Launch, extension settings will always be provided to the view.

Within the Init tab on the right side of the page, find the `extensionSettings` node inside the JSON. Paste your copied JSON for the value of `extensionSettings`. Click the "Init" button. You may also need to refresh your browser before the view begins working correctly.

### Running Views Dependent Upon Authentication

Some views may require authentication as well. When the extension runs inside Launch, Launch provides the extension the user's access token and org ID, which can then be used to access data from endpoints that require authentication. Because the local sandbox does not automatically provide the extension view a legitimate access token, you will need to obtain one and provide it to the extension view.

One way of obtaining and using an access token is as follows: 

1. Log into Launch.
1. Ensure you're on the org you'd like to be testing with.
1. Open the browser console and run the following command to retrieve the user access token: `copy(window.adobeIMS.getAccessToken())`
1. Open the local testing sandbox.
1. Click on the Init tab on the right side of the screen.
1. Paste the access token as the value for the `imsAccess` property.
1. Go back to the browser and run the following command to retrieve the org ID: `copy(user.corpId)`
1. Go back to the local testing sandbox.
1. Paste the org ID as the value for the `orgId` property.
1. Click the "Init" button. You may also need to refresh your browser before the view begins working correctly.

## Automated Testing

Automated testing runs some end-to-end tests that require authentication to the Adobe Experience Platform. Because we can't safely give public access to the Adobe Experience Platform account, these particular tests are restricted to Adobe employees who have been provided a private key to the Adobe I/O integration. When running tests, you may see a warning in your console indicating that some tests will be skipped because you don't have credentials set up. If you are not an Adobe employee and are working on related code, don't worry about running or updating these tests. Submit your pull request anyway and an Adobe employee will help ensure the code is properly tested.

For Adobe employees, please reach out to the `alloy-engineering` Slack channel and someone will help you access the private key and client secret for the Adobe I/O integration. Save the private key somewhere on your hard drive. Then, create two environment variables: 

* `EDGE_E2E_PRIVATE_KEY_FILE` - The value of this variable should be the path to the private key.
* `EDGE_E2E_CLIENT_SECRET` - The value of this variable should be the client secret.

Once the environment variables are configured, tests that require authentication should run successfully.
