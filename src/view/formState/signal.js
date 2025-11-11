import { signal, batch, computed } from "@preact/signals";


const LOADING_STATE_LOADING = "loading"
// const LOADING_STATE_SORTING = "sorting"
const LOADING_STATE_LOADING_MORE = "loadingMore"
const LOADING_STATE_ERROR = "error"
const LOADING_STATE_IDLE = "idle";
const LOADING_STATE_FILTERING = "filtering"

const pagedDynamicItemCollection = (args, loadItems, loadItemByKey) => {

  const allLoadedItems = [];
  const cursor = null;
  const cancelOutstandingRequest = () => undefined;

  const items = signal();
  const loadingState = signal(LOADING_STATE_LOADING);
  const inputValue = signal(""); // filter text

  effect(() => {
    const filterText = inputValue.value;
    if (filterText) {
      loadingState.setValue(LOADING_STATE_FILTERING);
      items.setValue(allLoadedItems.filter(item => item.label.toLowerCase().includes(filterText.toLowerCase())));
      if (cursor !== null) {
        cancelOutstandingRequest();
        const controller = new AbortController();
        cancelOutstandingRequest = () => controller.abort();
        loadItems({ args, filterText, cursor, signal: controller.signal })
        .then(({ items: loadedItems, cursor: newCursor }) => {
          batch(() => {
            items.setValue(loadedItems);
            cursor = newCursor;
            cancelOutstandingRequest = () => undefined;
          });
        })
        .catch((error) => {
          if (error.name !== "AbortError") {
            loadingState.setValue(LOADING_STATE_ERROR);
            console.error(error);
          }
        });
      } else {
        loadingState.setValue(LOADING_STATE_IDLE);
      }
    } else {
      batch(() => {
        loadingState.setValue(LOADING_STATE_IDLE);
        items.setValue([]);
      });
    });
    }



      items.setValue(allLoadedItems);
      loadItems({
        filterText,
        cursor,
        signal: controller.signal,
      }).then(({ items, cursor }) => {
    }
  });
  return {
    applyFilter: (text) => {

      items.setValue()
    },
    resetFilter: () => {
      cancelOutstandingRequest();
      cancelOutstandingRequest = () => undefined;
      items.setValue(allLoadedItems);
      loadingState.setValue(LOADING_STATE_IDLE);
    }
    items,
    loadingState,
    onLoadMore: () => {

    }
  }
}

const dynamicItemCollection = (args, loadItems) => {

}

const enumStore = (items, isRequired, dataElementSupported, allowCustomValue, defaultValue) => {

  const inputValue = signal();
  const selectionKey = signal();
  const touched = signal(false);

  const setting = computed(() => {
    return selectionKey.value || inputValue.value;
  });

  const onBlur = () => {
    if (selectionKey.value !== null) {
      touched.value = true;
      return;
    }
    const foundItem = items.value.find(item => item.label === inputValue.value);
    if (foundItem !== undefined) {
      batch(() => {
        touched.value = true;
        inputValue.value = foundItem.label;
        selectionKey.value = foundItem.key;
      });
    } else {
      batch(() => {
        touched.value = true;
        selectionKey.value = null;
      });
    }
  };

  const onSelectionChange = (key) => {
    batch(() => {
      inputValue.value = items.value.find(item => item.key === key)?.label || "";
      selectionKey.value = key;
    });
  };

  const onInputChange = (text) => {
    batch(() => {
      inputValue.value = text;
      selectionKey.value = null;
    });
  };

  // update the error based on the text and selected key
  const error = computed(() => {
    if (!touched.value || selected.value !== null) {
      return null;
    }
    if (inputValue.value === "" && isRequired) {
      return "This field is required.";
    }
    if (!allowCustomValue && !singleDataElementRegex.test(inputValue.value) && dataElementSupported) {
      return "Please select an option or specify a single data element.";
    }
    if (!allowCustomValue) {
      return "Please select an option from the list.";
    }
    return null;
  });

  const props = computed(() => {
    return {
      items: items.value,
      inputValue: inputValue.value,
      selectionKey: selectionKey.value,
      touched: touched.value,
      error: error.value,
      onBlur,
      onSelectionChange,
      onInputChange,
    };
  });

  return {
    props,
    setting,
    reset: (setting = defaultValue) => {
      batch(() => {
        const foundItem = items.value.find(item => item.key === setting);
        if (foundItem !== undefined) {
          inputValue.value = foundItem.label;
          selectionKey.value = foundItem.key;
        } else {
          inputValue.value = setting;
          selectionKey.value = null;
        }
        touched.value = false;
      });
    },
  };
}
