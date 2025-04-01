import { useState } from "react";
import { Box, Link } from "@mui/material";
import { truncate } from "lodash";
import { useTranslation } from "next-i18next";

type TruncateTextProps = {
  text: string;
  length?: number;
};

const squish = (text: string) => text.replace(/\s+/g, " ");

const TruncateText = ({ text, length = 150 }: TruncateTextProps) => {
  const { t } = useTranslation("common");

  // Mark as collapsed if text is longer than user-provided length
  const [isCollapsed, setIsCollapsed] = useState<boolean>(text.length > length);

  // If text is expanded, show everything
  if (!isCollapsed) return <>{text}</>;

  // If text is collapsed, show the first few words only
  // We set a custom separator to ensure that words are kept together.
  // See: https://stackoverflow.com/a/38150679/6451879
  return (
    <>
      {truncate(squish(text), { length: 150, separator: /,?\.* +/ })}{" "}
      <Box component="span" color="primary.main">
        <Link
          component="a"
          color="inherit"
          underline="hover"
          fontWeight={500}
          sx={{ cursor: "pointer" }}
          onClick={() => setIsCollapsed(false)}
        >
          {t("TRUNCATED_TEXT.MORE_BUTTON")}
        </Link>
      </Box>
    </>
  );
};

export default TruncateText;
