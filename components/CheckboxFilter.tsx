import { useCallback, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import {
  Autocomplete,
  Box,
  Button,
  Divider,
  IconButton,
  ListItemText,
  Menu,
  MenuItem,
  Popover,
  TextField,
  Typography,
} from "@mui/material";
import { Check, Close, DotsHorizontal } from "mdi-material-ui";
import { useTranslation } from "next-i18next";
import {
  anchorRef,
  bindMenu,
  bindPopover,
  bindTrigger,
  usePopupState,
} from "material-ui-popup-state/hooks";
import { styled } from "@mui/material/styles";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { omit } from "lodash";
import classNames from "classnames";

import type { AutocompleteCloseReason } from "@mui/material";
import type { CheckboxFilterValue, Filter } from "@/types/Filter";

const BUTTON_PROPS = {
  text: Object.freeze({
    color: "inherit",
    sx: {},
  }),
  outlined: Object.freeze({
    color: "primary",
    variant: "outlined",
    sx: {
      border: "1px solid black",
      transition: "color borderColor backgroundColor .3s ease-in-out",
      "&.has-value, &.is-open": {
        "&, &:hover": {
          color: "primary.contrastText",
          backgroundColor: "primary.main",
          borderColor: "primary.darker",
        },
      },
    },
  }),
};

type getOptionLabelForButtonFn = (option: CheckboxFilterValue) => string;

type renderButtonTextFn = ({
  label,
  selectedOptions,
  getOptionLabel,
}: {
  label: string;
  selectedOptions: CheckboxFilterValue[];
  getOptionLabel: getOptionLabelForButtonFn;
}) => string;

type CheckboxFilterProps = {
  filter: Filter;
  variant: "text" | "outlined";
  buttonLabel: string;
  autocompleteLabel: string;
  getOptionLabelForButton?: getOptionLabelForButtonFn;
  getOptionLabelForAutocomplete?: (option: CheckboxFilterValue) => string;
  renderButtonText?: renderButtonTextFn;
};

const CheckboxFilter = observer(
  ({
    filter,
    buttonLabel,
    autocompleteLabel,
    variant,
    ...params
  }: CheckboxFilterProps) => {
    const autocompleteRef = useRef<HTMLInputElement>(null);
    const filterPopover = usePopupState({
      variant: "popover",
      popupId: `${filter.name}-popover`,
    });
    const moreActionsMenu = usePopupState({
      variant: "popover",
      popupId: `${filter.name}-more-actions-menu`,
    });
    const { t } = useTranslation("filters");

    const defaultOptionLabel = useCallback(
      (option: CheckboxFilterValue) => {
        if (option === null) return t("FILTER.LABELS.NO_VALUE");
        return option;
      },
      [t]
    );

    const defaultRenderButtonText: renderButtonTextFn = useCallback(
      ({ label, selectedOptions, getOptionLabel }) => {
        return `${label}: ${selectedOptions.map(getOptionLabel).join(", ")}`;
      },
      []
    );

    const {
      getOptionLabelForButton,
      getOptionLabelForAutocomplete,
      renderButtonText,
    } = {
      getOptionLabelForButton: defaultOptionLabel,
      getOptionLabelForAutocomplete: defaultOptionLabel,
      renderButtonText: defaultRenderButtonText,
      ...params,
    };

    const inputValue = filter.inputValue;
    const setInputValue = filter.setInputValue;
    const flushValue = filter.flushValue;
    const hasValue = filter.hasValue;
    const isOpen = filter.isOpen;
    const options = filter.options;
    const closeFilter = filter.close;

    const hasSelectedNone = useMemo(
      () => inputValue.length === 0,
      [inputValue]
    );

    const hasSelectedAll = useMemo(
      () => inputValue.length === options.length,
      [inputValue, options]
    );

    const onChange = useCallback(
      (
        _event: React.ChangeEvent<unknown>,
        newSelectedOptions: CheckboxFilterValue[]
      ) => {
        setInputValue(newSelectedOptions);
      },
      [setInputValue]
    );

    // Select all options
    const selectAll = useCallback(
      () => setInputValue(options),
      [setInputValue, options]
    );

    // Unselect all options
    const unselectAll = useCallback(() => setInputValue([]), [setInputValue]);

    // On close, flush any pending calls of the debounced setValue function and
    // mark the filter as closed;
    const onClose = useCallback(() => {
      flushValue();
      closeFilter();
    }, [flushValue, closeFilter]);

    return (
      <>
        <Button
          {...bindTrigger(filterPopover)}
          ref={anchorRef(filterPopover)}
          onClick={filter.open}
          {...BUTTON_PROPS[variant]}
          className={classNames({ "has-value": hasValue, "is-open": isOpen })}
          sx={[
            {
              // No minimum width
              minWidth: "unset",
              // Limit chip width
              maxWidth: 180,
              whiteSpace: "nowrap",
            },
            BUTTON_PROPS[variant].sx,
          ]}
        >
          <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
            {renderButtonText({
              label: buttonLabel,
              selectedOptions: inputValue,
              getOptionLabel: getOptionLabelForButton,
            })}
          </span>
        </Button>
        <Popover
          {...bindPopover(filterPopover)}
          open={Boolean(filterPopover.anchorEl) && isOpen}
          onClose={onClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: -5, horizontal: 20 }}
          TransitionProps={{
            onEntering: () => {
              if (autocompleteRef.current) autocompleteRef.current.focus();
            },
          }}
        >
          <Autocomplete
            open
            value={inputValue}
            options={options}
            multiple
            fullWidth
            autoHighlight
            clearOnBlur={false}
            onClose={(
              _event: React.ChangeEvent<unknown>,
              reason: AutocompleteCloseReason
            ) => {
              if (reason === "escape") onClose();
            }}
            onChange={onChange}
            disableCloseOnSelect
            disablePortal
            PopperComponent={(props) => <AutocompletePopper {...props} />}
            getOptionLabel={getOptionLabelForAutocomplete}
            noOptionsText={t("AUTOCOMPLETE.NO_OPTIONS_TEXT")}
            renderOption={(props, option) => (
              <li {...props} style={{ padding: 0 }}>
                <Box paddingX={1} paddingY={0.5} display="flex" width={1}>
                  <Check
                    fontSize="small"
                    sx={{
                      visibility: inputValue.includes(option)
                        ? "visible"
                        : "hidden",
                      marginRight: 1,
                    }}
                  />
                  <Box flexGrow={1}>
                    <Typography
                      variant="body1"
                      component="span"
                      {...(option === null && {
                        sx: { fontStyle: "italic" },
                      })}
                    >
                      {getOptionLabelForAutocomplete(option)}
                    </Typography>
                  </Box>
                  <Close
                    fontSize="small"
                    sx={{
                      opacity: 0.6,
                      visibility: inputValue.includes(option)
                        ? "visible"
                        : "hidden",
                      marginRight: 0.5,
                    }}
                  />
                </Box>
              </li>
            )}
            renderInput={(params) => (
              <>
                <Box
                  display="flex"
                  alignItems="center"
                  paddingLeft={2}
                  paddingRight={1}
                  paddingTop={2}
                  paddingBottom={1}
                >
                  <TextField
                    ref={params.InputProps.ref}
                    inputRef={autocompleteRef}
                    size="small"
                    fullWidth
                    inputProps={params.inputProps}
                    autoFocus
                    label={autocompleteLabel}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      sx: { padding: "6px !important" },
                    }}
                    sx={{
                      marginRight: 1,
                    }}
                  />
                  <IconButton
                    size="small"
                    aria-label={t("FILTER_MENU.ARIA_LABEL")}
                    {...bindTrigger(moreActionsMenu)}
                  >
                    <DotsHorizontal fontSize="small" />
                  </IconButton>
                </Box>
                <Divider />
              </>
            )}
          />
        </Popover>
        <Menu {...bindMenu(moreActionsMenu)}>
          <MenuItem
            disabled={hasSelectedAll}
            onClick={() => {
              moreActionsMenu.close();
              selectAll();
            }}
          >
            <ListItemText>{t("FILTER_MENU.SELECT_ALL")}</ListItemText>
          </MenuItem>
          <MenuItem
            disabled={hasSelectedNone}
            onClick={() => {
              moreActionsMenu.close();
              unselectAll();
            }}
          >
            <ListItemText>{t("FILTER_MENU.SELECT_NONE")}</ListItemText>
          </MenuItem>
          <Divider />
          <MenuItem
            onClick={() => {
              moreActionsMenu.close();
              filter.reset();
            }}
          >
            <ListItemText>{t("FILTER_MENU.REMOVE_FILTER_BUTTON")}</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }
);

// From: https://mui.com/material-ui/react-autocomplete/#githubs-picker
const StyledAutocompletePopper = styled("div")(({ theme }) => ({
  [`& .${autocompleteClasses.paper}`]: {
    boxShadow: "none",
    margin: 0,
    color: "inherit",
  },
  [`& .${autocompleteClasses.listbox}`]: {
    padding: 0,
    paddingBottom: 8,
    [`& .${autocompleteClasses.option}`]: {
      minHeight: "auto",
      alignItems: "flex-start",
      padding: 8,
      borderBottom: `1px solid  ${
        theme.palette.mode === "light" ? " #eaecef" : "#30363d"
      }`,
      '&[aria-selected="true"]': {
        backgroundColor: "transparent",
      },
      [`&.${autocompleteClasses.focused}, &.${autocompleteClasses.focused}[aria-selected="true"]`]:
        {
          backgroundColor: theme.palette.action.hover,
        },
    },
  },
  [`&.${autocompleteClasses.popperDisablePortal}`]: {
    position: "relative",
  },
}));

const AutocompletePopper = (props: Record<string, unknown>) => {
  return (
    <StyledAutocompletePopper
      {...omit(props, ["disablePortal", "anchorEl", "open"])}
      sx={{ width: "100% !important" }}
    />
  );
};

export type { renderButtonTextFn };
export default CheckboxFilter;
