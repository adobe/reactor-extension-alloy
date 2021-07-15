/*
Copyright 2020 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import fetchFromEdge from "../../utils/fetchFromEdge";
import UserReportableError from "../../errors/userReportableError";

const fetchEnvironments = async ({
  orgId,
  imsAccess,
  edgeConfigId,
  search,
  start,
  limit,
  type,
  signal
}) => {
  const params = new URLSearchParams();
  params.append("orderby", "title");

  if (search) {
    params.append("property", `title:${search}`);
  }

  if (start) {
    params.append("start", start);
  }

  if (limit) {
    params.append("limit", limit);
  }

  if (type) {
    params.append("type", type);
  }

  let parsedResponse;

  try {
    parsedResponse = await fetchFromEdge({
      orgId,
      imsAccess,
      path: `/configs/user/edge/${edgeConfigId}/environments`,
      params,
      signal
    });
  } catch (e) {
    if (e.name === "AbortError") {
      throw e;
    }

    throw new UserReportableError("Failed to load datastream environments.", {
      originatingError: e
    });
  }

  const {
    parsedBody: { _embedded, page }
  } = parsedResponse;

  return {
    // eslint-disable-next-line no-underscore-dangle
    results: _embedded?.environments ?? [],
    // parsedBody.page won't exist if there were 0 results
    nextPage: page && page.totalPages > page.number ? page.number + 1 : null
  };
};

export default fetchEnvironments;
