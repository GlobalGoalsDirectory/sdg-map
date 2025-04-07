import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonBase,
  CircularProgress,
  Divider,
  IconButton,
  Link,
  Stack,
  Tooltip,
  Typography,
  Grid2 as Grid,
  SvgIcon,
  DialogContentText,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ChevronLeft,
  Close,
  Domain,
  Earth,
  Email,
  Facebook,
  Linkedin,
  MapMarker,
  Phone,
  Twitter,
} from "mdi-material-ui";
import { useTranslation } from "next-i18next";
import { Resize } from "@cloudinary/url-gen/actions/resize";
import {
  usePopupState,
  bindTrigger,
  bindDialog,
} from "material-ui-popup-state/hooks";
import Image from "@/components/Image";
import ExternalLink from "@/components/ExternalLink";
import TruncateText from "@/components/TruncateText";
import usePublicOrganization from "@/hooks/usePublicOrganization";
import useSdg from "@/hooks/useSdg";
import getSdgIcon from "@/helpers/getSdgIcon";
import getSdgColor from "@/helpers/getSdgColor";
import getSocialHandle from "@/helpers/getSocialHandle";
import cloudinary from "@/helpers/cloudinary";

import type { Organization } from "@/types/Organization";
import type { SdgNumber } from "@/types/SdgNumber";

type IframeMapDrawerProps = {
  organizationId: string | null;
  onClose: () => void;
  emailAddressForInquiries: string | null;
  showAiDisclaimer: boolean;
};

const IframeMapDrawer = ({
  organizationId,
  onClose,
  emailAddressForInquiries,
  showAiDisclaimer,
}: IframeMapDrawerProps) => {
  const { t } = useTranslation("iframe");

  // Cache last organization ID, so that we can safely close the drawer
  const [lastOrganizationId, setLastOrganizationId] = useState<string | null>(
    null
  );
  const { organization, isLoading } = usePublicOrganization(lastOrganizationId);

  useEffect(() => {
    // Open drawer when organizationId is set
    if (organizationId != null) setLastOrganizationId(organizationId);
  }, [organizationId]);

  return (
    <>
      <Box
        position="relative"
        bgcolor="white"
        width={1}
        height={1}
        boxShadow="0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)"
        sx={{
          overflowY: "auto",
          scrollbarWidth: "thin",
        }}
      >
        {!isLoading && organization != null ? (
          <DrawerContent
            organization={organization}
            emailAddressForInquiries={emailAddressForInquiries}
            showAiDisclaimer={showAiDisclaimer}
          />
        ) : (
          <LoadingIndicator />
        )}

        {/* Close drawer icon on top of drawer for all screen sizes */}
        <Box
          position="absolute"
          bgcolor="white"
          borderRadius="100%"
          right={16}
          top={16}
          zIndex={1100}
        >
          <IconButton
            aria-label={t("DRAWER.CLOSE_BUTTON.LABEL", { ns: "iframe" })}
            onClick={onClose}
          >
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Close drawer button for desktop screens */}
      <Box
        position="absolute"
        zIndex={-1}
        left="100%"
        top="calc(50% - 25px)"
        height={50}
        bgcolor="white"
        boxShadow="0px 0px 2px rgba(145, 158, 171, 0.2), 0px 12px 24px -4px rgba(145, 158, 171, 0.12)"
        display="flex"
        alignItems="center"
        overflow="hidden"
        sx={{
          borderTopRightRadius: 4,
          borderBottomRightRadius: 4,
          display: "none",
          "@container iframe (min-width: 600px)": {
            display: "block",
          },
        }}
      >
        <ButtonBase sx={{ width: 1, height: 1 }} onClick={onClose}>
          <ChevronLeft fontSize="small" />
        </ButtonBase>
      </Box>
    </>
  );
};

const hasDetails = (org: Organization) =>
  org.homepage ||
  org.street_address ||
  org.facebook_handle ||
  org.twitter_handle ||
  org.linkedin_handle;

const hasContactInfo = (org: Organization) =>
  org.email_address || org.phone_number;

type DrawerContentProps = {
  organization: Organization;
  emailAddressForInquiries: string | null;
  showAiDisclaimer: boolean;
};

const DrawerContent = ({
  organization,
  emailAddressForInquiries,
  showAiDisclaimer,
}: DrawerContentProps) => {
  const { t } = useTranslation("iframe");

  const hasFootnotes = emailAddressForInquiries != null || showAiDisclaimer;

  const dataCollectionDialogState = usePopupState({
    variant: "dialog",
    popupId: "data-collection-dialog",
  });

  return (
    <Box display="flex" flexDirection="column" minHeight={1} width={1}>
      <Box display="block">
        {organization.cover_image_id && (
          <Box position="relative" width={1} height={240}>
            <Box
              position="absolute"
              width={1}
              height={100}
              left={0}
              top={0}
              sx={{
                background: "linear-gradient(rgba(0,0,0,0.25),rgba(0,0,0,0))",
              }}
            />
            <Box
              position="absolute"
              width={1}
              height={1}
              left={0}
              top={0}
              sx={{
                // TODO: Replace cloudinary with generic image host / image URL
                background: `url(${cloudinary
                  .image(organization.cover_image_id)
                  // Scale down the image to 840px x 480px
                  .resize(Resize.limitFill().width(840).height(480))
                  .toURL()})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </Box>
        )}
        <Box paddingX={3} marginY={2}>
          <Box display="flex" minHeight="36px" alignItems="center">
            <Typography
              fontSize="1.25rem"
              fontWeight={500}
              // Same height as button for closing drawer
              // Keep distance from button for closing drawer
              paddingRight={4}
            >
              {organization.name}
            </Typography>
          </Box>
          {organization.description && (
            <Box marginY={1}>
              <Typography variant="body1" whiteSpace="pre-wrap">
                <TruncateText
                  key={organization.id}
                  text={organization.description.replace(/[\r\n]{3,}/g, "\n\n")}
                />
              </Typography>
            </Box>
          )}
        </Box>
        {hasContactInfo(organization) && (
          <>
            <Divider light />
            <Box paddingX={3} paddingY={2}>
              <GetInTouchButton
                key={organization.id}
                email={organization.email_address}
                phone={organization.phone_number}
              />
            </Box>
          </>
        )}
        {hasDetails(organization) && (
          <>
            <Divider light />
            <Box paddingX={3} paddingY={2}>
              <Stack spacing={1}>
                {organization.homepage && organization.domain && (
                  <OrganizationDetail
                    Icon={Earth}
                    href={organization.homepage}
                    label={organization.domain}
                  />
                )}
                {organization.facebook_handle && organization.facebook_url && (
                  <OrganizationDetail
                    Icon={Facebook}
                    href={organization.facebook_url}
                    label={getSocialHandle(organization.facebook_handle)}
                  />
                )}
                {organization.twitter_handle && organization.twitter_url && (
                  <OrganizationDetail
                    Icon={Twitter}
                    href={organization.twitter_url}
                    label={getSocialHandle(organization.twitter_handle)}
                  />
                )}
                {organization.linkedin_handle && organization.linkedin_url && (
                  <OrganizationDetail
                    Icon={Linkedin}
                    href={organization.linkedin_url}
                    label={getSocialHandle(organization.linkedin_handle)}
                  />
                )}
                {organization.type && (
                  <OrganizationDetail Icon={Domain} label={organization.type} />
                )}
                {organization.street_address && (
                  <OrganizationDetail
                    Icon={MapMarker}
                    label={organization.street_address}
                  />
                )}
              </Stack>
            </Box>
          </>
        )}
        <Divider light />
        <Box paddingX={3} paddingY={2}>
          <Typography variant="body1" fontWeight={500} marginBottom={1}>
            {t("DRAWER.SDGS.HEADING", { ns: "iframe" })}
          </Typography>
          <Grid container spacing={1}>
            {organization.sdgs.map((sdgNumber) => (
              <Grid key={sdgNumber}>
                <Sdg number={sdgNumber} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      <Box flexGrow={1} />
      {hasFootnotes && (
        <Box paddingX={3} paddingY={2} display="block">
          <Stack spacing={2}>
            {emailAddressForInquiries && (
              <ExternalLink
                href={`mailto:${emailAddressForInquiries}`}
                passHref
              >
                <Link variant="body2" color="textSecondary" underline="hover">
                  {t("DRAWER.REPORT_ERROR.LABEL", { ns: "iframe" })}
                </Link>
              </ExternalLink>
            )}
            {showAiDisclaimer && (
              <>
                <Link
                  component="button"
                  variant="body2"
                  color="textSecondary"
                  underline="hover"
                  {...bindTrigger(dataCollectionDialogState)}
                  sx={{ textAlign: "left" }}
                >
                  {t("DRAWER.DATA_COLLECTION.LABEL", { ns: "iframe" })}
                </Link>
                <Dialog {...bindDialog(dataCollectionDialogState)}>
                  <DialogTitle>
                    {t("DIALOG.DATA_COLLECTION.TITLE", { ns: "iframe" })}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                      {t("DIALOG.DATA_COLLECTION.BODY", { ns: "iframe" })}
                    </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={dataCollectionDialogState.close}>
                      {t("DIALOG.DATA_COLLECTION.CLOSE_BUTTON", {
                        ns: "iframe",
                      })}
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
};

type GetInTouchButtonProps = {
  email: string | undefined;
  phone: string | undefined;
};

const GetInTouchButton = ({ email, phone }: GetInTouchButtonProps) => {
  const { t } = useTranslation("iframe");
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const displayContactInfo = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

  return (
    <>
      {!isVisible && (
        <Button
          variant="contained"
          color="primary"
          disableElevation
          onClick={displayContactInfo}
        >
          {t("DRAWER.GET_IN_TOUCH_BUTTON.LABEL", { ns: "iframe" })}
        </Button>
      )}
      {isVisible && (
        <Stack spacing={1}>
          {email && (
            <OrganizationDetail
              Icon={Email}
              href={`mailto:${email}`}
              label={email}
            />
          )}
          {phone && (
            <OrganizationDetail
              Icon={Phone}
              href={`tel:${phone}`}
              label={phone}
            />
          )}
        </Stack>
      )}
    </>
  );
};

type OrganizationDetailProps = {
  Icon: typeof SvgIcon;
  href?: string;
  label: string;
};

const OrganizationDetail = ({ Icon, href, label }: OrganizationDetailProps) => (
  <Box display="flex" alignItems="center">
    <Icon fontSize="small" color="primary" sx={{ marginRight: 1 }} />
    {href ? (
      <ExternalLink href={href} passHref>
        <Link variant="body2" color="inherit" underline="hover">
          {label}
        </Link>
      </ExternalLink>
    ) : (
      <Typography variant="body2">{label}</Typography>
    )}
  </Box>
);

type SdgProps = {
  number: SdgNumber;
};

const Sdg = ({ number }: SdgProps) => {
  const { t } = useTranslation("common");
  const sdg = useSdg(number);

  return (
    <Tooltip
      followCursor
      disableInteractive
      placement="bottom-start"
      title={
        <>
          <Box fontWeight={700} component="span">
            {t("SDG_NUMBER_AND_TITLE", {
              number: sdg.number,
              title: sdg.title,
              ns: "common",
            })}
          </Box>
          <br />
          {sdg.description}
        </>
      }
    >
      <Box width={1}>
        <Image
          src={getSdgIcon(number)}
          alt={`SDG ${number} Icon`}
          width={84}
          height={84}
          style={{
            display: "block",
            borderRadius: 4,
            backgroundColor: getSdgColor(number),
          }}
        />
      </Box>
    </Tooltip>
  );
};

const LoadingIndicator = () => (
  <Box
    width={1}
    height={1}
    display="flex"
    justifyContent="center"
    alignItems="center"
  >
    <CircularProgress />
  </Box>
);

export default IframeMapDrawer;
