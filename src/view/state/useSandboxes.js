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
import fetchSandboxes from "../utils/fetchSandboxes";

export default ({ orgId, imsAccess }) => {
  const [sandboxes, setSandboxes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getSandboxes = async () => {
      setLoading(true);
      try {
        const { results: firstPageOfSandboxes } = await fetchSandboxes(
          orgId,
          imsAccess,
        );
        if (sandboxes && sandboxes.length) {
          setSandboxes(firstPageOfSandboxes);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    if (orgId && imsAccess) {
      getSandboxes();
    }
  }, [orgId, imsAccess]);

  return {
    sandboxes,
    loading,
    error,
  };
};
