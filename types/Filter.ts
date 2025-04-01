import type { DebouncedFunc } from "lodash";

export type FilterName =
  | "sdg"
  | "was_analyzed"
  | "tag"
  | "type"
  | "sector"
  | "zip_code"
  | "locality"
  | "county";

export type BaseFilter = {
  isEnabled: boolean;
  isVisible: boolean;
  isOpen: boolean;
  hasValue: boolean;
  enable: () => void;
  disable: () => void;
  show: () => void;
  open: () => void;
  close: () => void;
  reset: () => void;
  query: string[][];
};

export type SearchFilter = BaseFilter & {
  name: "search";
  type: "search";
  value: string;
  inputValue: string;
  setInputValue: (value: string) => void;
  setValue: (value: string) => void;
  setValueDebounced: DebouncedFunc<(value: string) => void>;
  flushValue: () => void;
};

export type CheckboxFilterValue = string | null;

export type CheckboxFilter = BaseFilter & {
  name: FilterName;
  type: "checkbox";
  value: CheckboxFilterValue[];
  inputValue: CheckboxFilterValue[];
  setInputValue: (value: CheckboxFilterValue[]) => void;
  setValue: (value: CheckboxFilterValue[]) => void;
  setValueDebounced: DebouncedFunc<(value: CheckboxFilterValue[]) => void>;
  flushValue: () => void;
  options: CheckboxFilterValue[];
  setOptions: (options: CheckboxFilterValue[]) => void;
};

export type Filter = CheckboxFilter;
