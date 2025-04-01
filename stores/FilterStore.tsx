import { createContext, PropsWithChildren, useContext, useState } from "react";
import { makeAutoObservable, observable } from "mobx";
import { debounce } from "lodash";

import type {
  FilterName,
  CheckboxFilter,
  CheckboxFilterValue,
  SearchFilter,
} from "@/types/Filter";

type FilterOptions = {
  alwaysEnabled?: boolean;
  fixedOptions?: string[];
};

const searchFilter = (name: "search") => {
  const filter: SearchFilter = observable<SearchFilter>(
    {
      name,
      type: "search",
      // Current value for this filter
      value: "",
      // Current value for the input element
      inputValue: "",
      isEnabled: true,
      isVisible: true,
      // Whether the filter is currently open
      isOpen: false,
      get hasValue() {
        return filter.value !== "";
      },
      get query() {
        if (!filter.hasValue) return [];
        return [[filter.name, filter.value]];
      },
      setInputValue: function (newValue: string) {
        filter.inputValue = newValue;
        filter.setValueDebounced(newValue);
      },
      setValue: function (newValue: string) {
        // Cancel any pending values
        filter.setValueDebounced.cancel();

        // Set new value
        filter.value = newValue;
        filter.inputValue = newValue;
      },
      setValueDebounced: debounce(function (newValue: string) {
        filter.setValue(newValue);
      }, 500),
      flushValue: function () {
        filter.setValueDebounced.flush();
      },
      enable: () => null,
      disable: () => null,
      show: () => null,
      open: function () {
        filter.isOpen = true;
      },
      close: function () {
        filter.isOpen = false;
      },
      reset: function () {
        filter.isOpen = false;
        filter.setValue("");
      },
    },
    {
      // Do not observe the debounced function, otherwise the .flush() and
      // cancel() operations will not work
      setValueDebounced: false,
    }
  );

  return filter;
};

const checkboxFilter = (
  name: FilterName,
  { alwaysEnabled = false, fixedOptions }: FilterOptions = {}
): CheckboxFilter => {
  const filter: CheckboxFilter = observable<CheckboxFilter>(
    {
      name,
      type: "checkbox",
      // Current values for this filter
      value: [],
      // Current input values for this filter
      inputValue: [],
      // Allowed values for this filter
      options: fixedOptions === undefined ? [] : fixedOptions,
      // Whether the filter is available in the "Add filter" menu
      isEnabled: alwaysEnabled ? true : false,
      // Whether the filter has been added by the user via the "Add filter" menu
      isVisible: false,
      // Whether the filter popover is currently open
      isOpen: false,
      get hasValue() {
        return filter.value.length !== 0;
      },
      get query() {
        return filter.value.map((value) => {
          if (value === null) return [name, ""];
          return [name, value];
        });
      },
      setInputValue: function (newValue: CheckboxFilterValue[]) {
        filter.inputValue = filter.options.filter((option) =>
          newValue.includes(option)
        );
        filter.setValueDebounced(newValue);
      },
      setValue: function (newValue: CheckboxFilterValue[]) {
        // Cancel any pending values
        filter.setValueDebounced.cancel();

        // Set new value
        filter.value = filter.options.filter((option) =>
          newValue.includes(option)
        );
        filter.inputValue = [...filter.value];
      },
      setValueDebounced: debounce(function (newValue: CheckboxFilterValue[]) {
        filter.setValue(newValue);
      }, 500),
      flushValue: function () {
        filter.setValueDebounced.flush();
      },
      setOptions: function (newOptions: CheckboxFilterValue[]) {
        // Options are hard-coded
        if (fixedOptions !== undefined) return;

        filter.options = newOptions;

        // Re-run the value setter as this will filter out any values that are no
        // longer valid options
        filter.setValue(filter.value);
      },
      enable: function () {
        filter.isEnabled = true;
      },
      disable: function () {
        // Filter cannot be disabled
        if (alwaysEnabled) return;

        filter.reset();
        filter.isEnabled = false;
      },
      show: function () {
        filter.isVisible = true;
        filter.open();
      },
      open: function () {
        filter.isOpen = true;
      },
      close: function () {
        filter.isOpen = false;
      },
      reset: function () {
        filter.isOpen = false;
        filter.isVisible = false;
        filter.setValue([]);
      },
    },
    {
      // Do not observe the debounced function, otherwise the .flush() and
      // cancel() operations will not work
      setValueDebounced: false,
    }
  );

  return filter;
};

class FilterStore {
  searchFilter: SearchFilter;
  filters: CheckboxFilter[];

  constructor() {
    this.searchFilter = searchFilter("search");
    this.filters = [
      checkboxFilter("sdg", {
        alwaysEnabled: true,
        fixedOptions: [
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
        ],
      }),
      checkboxFilter("was_analyzed", {
        alwaysEnabled: true,
        fixedOptions: ["true", "false"],
      }),
      checkboxFilter("type"),
      checkboxFilter("sector"),
      checkboxFilter("zip_code"),
      checkboxFilter("locality"),
      checkboxFilter("county"),
      checkboxFilter("tag"),
    ];

    makeAutoObservable(this, {}, { autoBind: true });
  }

  get enabledFilters() {
    return this.filters.filter((filter) => filter.isEnabled);
  }

  get visibleFilters() {
    return this.filters.filter((filter) => filter.isVisible);
  }

  get hasVisibleFilters() {
    return this.filters.some((filter) => filter.isVisible);
  }

  get filterQuery() {
    return new URLSearchParams([
      ...this.searchFilter.query,
      ...this.filters.flatMap((filter) => filter.query),
    ]).toString();
  }

  resetAllFilters() {
    this.filters.forEach((f) => f.reset());
  }
}

const filterStoreContext = createContext<FilterStore | null>(null);

export const FilterStoreProvider = (props: PropsWithChildren) => {
  const [filterStore] = useState(() => new FilterStore());

  return <filterStoreContext.Provider {...props} value={filterStore} />;
};

export const useFilterStore = () => {
  const filterStore = useContext(filterStoreContext);
  if (!filterStore) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error(
      "useFilterStore must be used within a FilterStoreProvider."
    );
  }
  return filterStore;
};
