/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

export default () => {
  const namespaceApiResponse = [
    {
      updateTime: 1551688425455,
      code: "CORE",
      status: "ACTIVE",
      description: "Adobe Audience Manger UUID",
      id: 0,
      createTime: 1551688425455,
      idType: "COOKIE",
      name: "CORE",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "AAID",
      status: "ACTIVE",
      description: "Adobe Analytics (Legacy ID)",
      id: 10,
      createTime: 1551688425455,
      idType: "CROSS_DEVICE",
      name: "Adobe Analytics (Legacy ID)",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "ECID",
      status: "ACTIVE",
      description: "Adobe Experience Cloud ID",
      id: 4,
      createTime: 1551688425455,
      idType: "COOKIE",
      name: "ECID",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "Email",
      status: "ACTIVE",
      description: "Email",
      id: 6,
      createTime: 1551688425455,
      idType: "CROSS_DEVICE",
      name: "Email",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "WAID",
      status: "ACTIVE",
      description: "Windows AID",
      id: 8,
      createTime: 1551688425455,
      idType: "CROSS_DEVICE",
      name: "Windows AID",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "Phone",
      status: "ACTIVE",
      description: "Phone",
      id: 7,
      createTime: 1551688425455,
      idType: "CROSS_DEVICE",
      name: "Phone",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "TNTID",
      status: "ACTIVE",
      description: "Adobe Target (TNTID)",
      id: 9,
      createTime: 1551688425455,
      idType: "CROSS_DEVICE",
      name: "TNTID",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "AdCloud",
      status: "ACTIVE",
      description: "Adobe AdCloud - ID Syncing Partner",
      id: 411,
      createTime: 1551688425455,
      idType: "COOKIE",
      name: "AdCloud",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "Email_LC_SHA256",
      status: "ACTIVE",
      description:
        "Email addresses need to be hashed using SHA256 and lowercased. Please also note that leading and trailing spaces need to be trimmed before an email address is normalized. You won't be able to change this setting later",
      id: 11,
      createTime: 1551688425455,
      idType: "Email",
      name: "Emails (SHA256, lowercased)",
      custom: false,
      hashFunction: "SHA256",
      transform: "lowercase"
    },
    {
      updateTime: 1556676459431,
      code: "Google",
      status: "ACTIVE",
      id: 771,
      createTime: 1556676459431,
      idType: "COOKIE",
      name: "Google",
      custom: false
    },
    {
      updateTime: 1551688425455,
      code: "GAID",
      status: "ACTIVE",
      description: "This datasource is associated to a Google Ad ID",
      id: 20914,
      createTime: 1551688425455,
      idType: "MOBILE",
      name: "Google Ad ID (GAID)",
      custom: false
    },
    {
      updateTime: 1476993749000,
      code: "IDFA",
      status: "ACTIVE",
      description:
        "Apple ID for Advertisers. See: https://support.apple.com/en-us/HT202074 for more info.",
      id: 20915,
      createTime: 1476993749000,
      idType: "MOBILE",
      name: "Apple IDFA (ID for Advertisers)",
      custom: false
    },
    {
      updateTime: 1559600046005,
      code: "APNS",
      status: "ACTIVE",
      description:
        "Identities collected via Apple for Push notification Service",
      id: 20920,
      createTime: 1559600046005,
      idType: "MOBILE",
      name: "Apple Push Notification service",
      custom: false
    },
    {
      updateTime: 1559600061630,
      code: "FCM",
      status: "ACTIVE",
      description:
        "Identities collected via Google for Push notification Service",
      id: 20919,
      createTime: 1559600061630,
      idType: "MOBILE",
      name: "Firebase Cloud Messaging",
      custom: false
    },
    {
      updateTime: 1560902724235,
      code: "GCLID",
      status: "ACTIVE",
      description:
        "Identifier for tracking surfers activities on clicking the AdWords ad",
      id: 12,
      createTime: 1560902724235,
      idType: "CROSS_DEVICE",
      name: "Google Click ID",
      custom: false
    },
    {
      updateTime: 1570746432714,
      code: "AppNexus",
      status: "ACTIVE",
      description: "Namespace for ID Syncing with AppNexus",
      id: 358,
      createTime: 1570746432714,
      idType: "COOKIE",
      name: "AppNexus",
      custom: false
    },
    {
      updateTime: 1570746432714,
      code: "MicrosoftBing",
      status: "ACTIVE",
      description: "Namespace for ID Syncing with Microsoft Bing",
      id: 1957,
      createTime: 1570746432714,
      idType: "COOKIE",
      name: "Microsoft Bing",
      custom: false
    },
    {
      updateTime: 1570746432714,
      code: "TradeDesk",
      status: "ACTIVE",
      description: "Namespace for ID Syncing with TradeDesk",
      id: 903,
      createTime: 1570746432714,
      idType: "COOKIE",
      name: "TradeDesk",
      custom: false
    },
    {
      updateTime: 1570746432714,
      code: "MediaMath",
      status: "ACTIVE",
      description: "Namespace for ID Syncing with Media Math",
      id: 269,
      createTime: 1570746432714,
      idType: "COOKIE",
      name: "Media Math",
      custom: false
    },
    {
      updateTime: 1572004584432,
      code: "ExternalSegment",
      status: "ACTIVE",
      id: 10013876,
      createTime: 1572004584432,
      idType: "COOKIE",
      name: "ExternalSegment",
      custom: true
    },
    {
      updateTime: 1564909060049,
      code: "HYP",
      status: "ACTIVE",
      id: 10000541,
      createTime: 1564909060049,
      idType: "CROSS_DEVICE",
      name: "CRM ID",
      custom: true
    },
    {
      updateTime: 1567105866514,
      code: "JK",
      status: "ACTIVE",
      id: 10002236,
      createTime: 1567105866514,
      idType: "COOKIE",
      name: "Joe",
      custom: true
    }
  ];

  // (async () => {
  //   const response = await fetch('https://platform-int.adobe.io/data/core/idnamespace/identities6*');
  //   const myJson = await response.json();
  //   console.log(JSON.stringify(myJson));
  // })();

  const namespaceOptionsPromise = new Promise(resolve => {
    const getOptions = response => {
      const options = response.map(namespace => ({
        value: namespace.code,
        label: namespace.code
      }));

      resolve(options);
    };

    setTimeout(() => {
      getOptions(namespaceApiResponse);
    }, 200);
  });

  return namespaceOptionsPromise;
};
