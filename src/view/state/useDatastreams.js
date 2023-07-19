/*
Copyright 2023 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/
import { useEffect, useState } from "react";
import fetchConfigs from "../configuration/utils/fetchConfigs";

export default ({ orgId, imsAccess, sandbox, limit = 1000 }) => {
  const [datastreams, setDatastreams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDatastreams = async () => {
      setLoading(true);
      try {
        const { results: firstPageOfDatastreams } = await fetchConfigs({
          orgId,
          imsAccess,
          sandbox,
          limit
        });
        if (datastreams && datastreams.length) {
          setDatastreams(firstPageOfDatastreams);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    if (orgId && imsAccess && sandbox) {
      getDatastreams();
    }
  }, [orgId, imsAccess, sandbox, limit]);

  return {
    datastreams,
    loading,
    error
  };
};
