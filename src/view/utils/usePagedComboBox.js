/*
Copyright 2021 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import { useRef, useEffect } from "react";
import useForceRender from "./useForceRender";

const LOADING_STATE = {
  IDLE: "idle",
  LOADING: "loading",
  LOADING_MORE: "loadingMore",
  FILTERING: "filtering"
};

/**
 * Keys of the state that we expose to the host component using this hook.
 */
const EXTERNAL_DATA_KEYS = [
  "items",
  "selectedItem",
  "inputValue",
  "loadingState"
];

const usePagedComboBox = ({
  defaultSelectedItem,
  loadItems,
  getKey,
  getLabel,
  firstPage,
  firstPageCursor
}) => {
  // This state management has been attempted using useState and
  // useReducer, but it ended up complicating the implementation because
  // we have a decent amount of logic that relies on the most recent state.
  // Because useState sets state asynchronously and useReducer calls the
  // reducer asynchronously, being able to reference the latest state when
  // we need it becomes becomes unwieldy. Note that using useState and useReducer
  // would typically cause the component using our hook to re-render whenever
  // state is updated, so one caveat to using useRef for managing state instead
  // is that we have/get to control when re-renders occur.
  const forceRender = useForceRender();
  const dataRef = useRef({
    items: firstPage || [],
    selectedItem: defaultSelectedItem || null,
    inputValue: defaultSelectedItem ? getLabel(defaultSelectedItem) : "",
    loadingState: LOADING_STATE.IDLE,
    showAll: true,
    cursor: firstPageCursor,
    abortController: null,
    firstPage: firstPage || [],
    firstPageCursor
  });

  const setData = changes => {
    let needsRender = false;
    Object.keys(changes).forEach(key => {
      if (dataRef.current[key] !== changes[key]) {
        // If any of the changes are for data we expose to the
        // host component, we need to re-render the component
        // so it receives the new data.
        if (EXTERNAL_DATA_KEYS.includes(key)) {
          needsRender = true;
        }
        dataRef.current[key] = changes[key];
      }
    });
    if (needsRender) {
      forceRender();
    }
  };

  const getItem = key => {
    // Sometimes getItem is called with a key that doesn't match an item in
    // itemsRef, but instead matches the currently selected item.
    // For example, if a user changes the filter text and then blurs off the ComboBox
    // without selecting a new item, onSelectionChange will be called with the key
    // of the item that was already selected. However, our list of items (itemsRef)
    // may not contain the item that's selected. This would occur for example,
    // if the user typed "X" and our currently selected item didn't have an
    // X in its label, then the user blurred off the ComboBox. In this case,
    // our list of items would only contain items that have an X in their label.
    // For this reason, we _also_ need to check our currently selected item.
    if (
      dataRef.current.selectedItem &&
      getKey(dataRef.current.selectedItem) === key
    ) {
      return dataRef.current.selectedItem;
    }
    return dataRef.current.items.find(item => key === getKey(item));
  };

  const load = async loadingState => {
    setData({
      loadingState
    });

    if (dataRef.current.abortController) {
      dataRef.current.abortController.abort();
    }

    const currentLoadAbortController = new AbortController();
    setData({
      abortController: currentLoadAbortController
    });

    const loadItemsArgs = {
      filterText: dataRef.current.showAll ? "" : dataRef.current.inputValue,
      cursor: dataRef.current.cursor,
      signal: dataRef.current.abortController.signal
    };

    let newItems;
    let newCursor;

    try {
      ({ items: newItems, cursor: newCursor } = await loadItems(loadItemsArgs));
    } catch (e) {
      if (e.name !== "AbortError") {
        // We do not throw the error because we expect that loadItems
        // catches the error and has handled it however it sees fit.
        // console.error("Error loading items", e);
        return;
      }
    }

    if (currentLoadAbortController.signal.aborted) {
      return;
    }

    const newData = {
      items: dataRef.current.cursor
        ? dataRef.current.items.concat(newItems)
        : newItems,
      cursor: newCursor,
      loadingState: LOADING_STATE.IDLE
    };
    if (loadItemsArgs.filterText === "") {
      newData.firstPage = newData.items;
      newData.firstPageCursor = newData.cursor;
    }
    setData(newData);
  };

  // Prep the first page of unfiltered results so it will be ready
  // if the user opens the menu manually.
  useEffect(() => {
    if (dataRef.current.items.length === 0) {
      load(LOADING_STATE.LOADING);
    }
  }, []);

  let result = {
    clear: () => {
      setData({
        items: [],
        inputValue: "",
        cursor: null
      });
      load(LOADING_STATE.LOADING);
    },
    onInputChange: inputText => {
      setData({
        inputValue: inputText,
        showAll: false,
        cursor: null
      });
      load(LOADING_STATE.FILTERING);
    },
    onSelectionChange: key => {
      const newlySelectedItem = getItem(key);
      setData({
        selectedItem: newlySelectedItem,
        inputValue: newlySelectedItem ? getLabel(newlySelectedItem) : ""
      });
    },
    onOpenChange: isOpen => {
      if (!isOpen) {
        setData({
          items: dataRef.current.firstPage,
          cursor: dataRef.current.firstPageCursor,
          loadingState: LOADING_STATE.IDLE,
          showAll: true
        });
        if (dataRef.current.firstPage.length === 0) {
          load(LOADING_STATE.LOADING);
        }
      }
    },
    onLoadMore: () => {
      if (
        dataRef.current.loadingState === LOADING_STATE.IDLE &&
        dataRef.current.cursor
      ) {
        load(LOADING_STATE.LOADING_MORE);
      }
    }
  };

  result = EXTERNAL_DATA_KEYS.reduce((memo, key) => {
    memo[key] = dataRef.current[key];
    return memo;
  }, result);

  return result;
};

export default usePagedComboBox;
