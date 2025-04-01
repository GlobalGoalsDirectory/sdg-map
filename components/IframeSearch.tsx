import { useCallback, useMemo, useState, useRef } from "react";
import { observer } from "mobx-react-lite";
import {
  Box,
  ButtonBase,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  TypographyProps,
} from "@mui/material";
import { useAutocomplete } from "@mui/material";
import { autocompleteClasses } from "@mui/material/Autocomplete";
import { Close, Magnify, MapMarker, Plus } from "mdi-material-ui";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { useTranslation } from "next-i18next";
import { useIframeStore } from "@/stores/IframeStore";
import usePublicOrganizationSearch from "@/hooks/usePublicOrganizationSearch";

import type { ChangeEvent, ReactNode } from "react";
import type { OrganizationSearchResult } from "@/types/Organization";

const buttonVariants = {
  collapsed: { borderRadius: 18, width: 36 },
  expanded: (expandedWidth: number) => ({
    borderRadius: 4,
    width: expandedWidth,
  }),
};

const textfieldVariants = {
  collapsed: { opacity: 0 },
  expanded: { opacity: 1 },
};

type AutocompleteOption = {
  id: string;
  icon?: ReactNode;
  primaryText: string;
  secondaryText?: string;
  typographyProps?: TypographyProps<"span">;
  onSelect: () => void;
};

type IframeSearchProps = {
  expandedWidth: number;
  emailAddressForInquiries: string | null;
};

const IframeSearch = observer(
  ({ expandedWidth, emailAddressForInquiries }: IframeSearchProps) => {
    const { t } = useTranslation("iframe");

    const iframeStore = useIframeStore();

    const textFieldRef = useRef<HTMLInputElement>(null);
    const [inputValue, setInputValue] = useState<string>("");
    const [value, setValue] = useState<string>("");
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    const { organizations, isLoading } = usePublicOrganizationSearch(value);

    const setValueDebounced = useMemo(
      () => debounce(setValue, 250),
      [setValue]
    );
    const setFocus = useCallback(() => textFieldRef.current?.focus(), []);

    const openSearch = useCallback(() => {
      if (isExpanded) setFocus();
      setIsExpanded(true);
    }, [isExpanded, setFocus, setIsExpanded]);

    const onChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = event.currentTarget.value;
        setInputValue(newValue);
        setValueDebounced(newValue.trim());
      },
      [setInputValue, setValueDebounced]
    );

    const closeAndClearSearch = useCallback(() => {
      setInputValue("");
      setValue("");
      setIsExpanded(false);
    }, [setInputValue, setIsExpanded]);

    const selectOrganization = useCallback(
      (organization: OrganizationSearchResult) => {
        iframeStore.flyTo(organization.latitude, organization.longitude);
        iframeStore.selectOrganization(organization);
        textFieldRef.current?.blur();
      },
      [iframeStore]
    );

    // Options for the autocomplete
    const options: AutocompleteOption[] = useMemo(() => {
      const options: AutocompleteOption[] = (organizations || []).map(
        (organization) => ({
          id: organization.id,
          icon: <MapMarker fontSize="small" color="primary" />,
          primaryText: organization.name,
          // Display domain as secondary text, if it differs from
          // the name of the organization
          secondaryText:
            organization.domain !== organization.name
              ? organization.domain
              : undefined,
          onSelect: () => selectOrganization(organization),
        })
      );

      // If emailAddressForInquiries is set and user has typed any text, show
      // 'Add new entry' option
      if (emailAddressForInquiries && value.length > 0)
        options.push({
          id: "add-entry",
          icon: <Plus fontSize="small" color="primary" />,
          primaryText: t("SEARCH_AUTOCOMPLETE.ADD_NEW_ENTRY"),
          onSelect: () =>
            window.open(`mailto:${emailAddressForInquiries}`, "_blank"),
        });

      return options;
    }, [t, organizations, selectOrganization, value, emailAddressForInquiries]);

    const {
      getRootProps,
      getInputProps,
      getListboxProps,
      getOptionProps,
      groupedOptions,
    } = useAutocomplete({
      filterOptions: (x) => x,
      inputValue: inputValue,
      options,
      getOptionLabel: (option) => option.primaryText,
      openOnFocus: true,
      onChange: (_event, option) => option && option.onSelect(),
      // Keep value always at null, so that onChange triggers whenever a user
      // clicks on a search result from the list. Otherwise onChange would not be
      // triggered, if the user re-selects a previous value and the map would not
      // be re-centered.
      value: null,
    });

    return (
      <Box
        component={motion.div}
        initial="collapsed"
        animate={isExpanded ? "expanded" : "collapsed"}
        variants={buttonVariants}
        bgcolor="white"
        boxShadow="0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)"
        overflow="hidden"
        custom={expandedWidth}
        borderRadius={1}
      >
        <Box display="flex" alignItems="center">
          <ButtonBase
            focusRipple
            onClick={openSearch}
            aria-label={t("SEARCH_AUTOCOMPLETE.SEARCH_BUTTON_ARIA_LABEL")}
            sx={(theme) => ({
              borderRadius: 0,
              padding: 1,
              ":hover": { background: theme.palette.action.hover },
            })}
          >
            <Magnify fontSize="small" />
          </ButtonBase>
          <Box
            component={motion.div}
            initial="collapsed"
            animate={isExpanded ? "expanded" : "collapsed"}
            variants={textfieldVariants}
            display="flex"
            onAnimationComplete={setFocus}
            overflow="hidden"
            width={1}
          >
            <Box {...getRootProps()} alignSelf="flex-end" width={1}>
              <TextField
                inputRef={textFieldRef}
                onChange={onChange}
                placeholder={t("SEARCH_AUTOCOMPLETE.PLACEHOLDER_TEXT")}
                margin="none"
                size="small"
                variant="standard"
                fullWidth
                inputProps={getInputProps()}
                // Remove the gray underline from the input element
                // The primary color underline on focus remains visible
                InputProps={{ sx: { ":before": { display: "none" } } }}
              />
            </Box>
            <ButtonBase
              focusRipple
              onClick={closeAndClearSearch}
              sx={(theme) => ({
                borderRadius: 0,
                padding: 1,
                ":hover": { background: theme.palette.action.hover },
              })}
            >
              <Close fontSize="small" />
            </ButtonBase>
          </Box>
        </Box>
        {isExpanded && (isLoading || groupedOptions.length > 0) && (
          <Box width={1}>
            <Divider />
            <List
              dense
              {...getListboxProps()}
              sx={{ overflowY: "auto", maxHeight: 240 }}
            >
              {isLoading && (
                <ListItem dense>
                  <ListItemText
                    primary={t("SEARCH_AUTOCOMPLETE.LOADING_TEXT")}
                    primaryTypographyProps={{
                      variant: "body2",
                      color: "textSecondary",
                    }}
                  />
                </ListItem>
              )}
              {!isLoading &&
                (groupedOptions as AutocompleteOption[]).map(
                  (option, index) => (
                    <ListItem
                      dense
                      {...getOptionProps({ option, index })}
                      key={option.id}
                      sx={(theme) => ({
                        paddingX: 1,
                        wordWrap: "break-word",
                        cursor: "pointer",
                        [`&.${autocompleteClasses.focused}`]: {
                          backgroundColor: theme.palette.action.hover,
                        },
                      })}
                    >
                      {option.icon && (
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          {option.icon}
                        </ListItemIcon>
                      )}
                      <ListItemText
                        primary={option.primaryText}
                        slotProps={{
                          primary: option.typographyProps,
                          secondary: option.typographyProps,
                        }}
                        secondary={option.secondaryText}
                      />
                    </ListItem>
                  )
                )}
            </List>
          </Box>
        )}
      </Box>
    );
  }
);

export default IframeSearch;
