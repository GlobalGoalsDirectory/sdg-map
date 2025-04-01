import { LinkProps } from "@mui/material";
import { Children, cloneElement, isValidElement } from "react";

import type { PropsWithChildren, ElementType } from "react";

type ExternalLinkProps = PropsWithChildren & {
  href: string;
  passHref: true;
  Component?: ElementType | null;
};

const ExternalLink = ({
  children,
  href,
  passHref,
  Component = null,
}: ExternalLinkProps) => {
  if (!passHref) new Error("passHref is required on <ExternalLink />");

  // If a Component wrapper (such as an a-tag or Link component) has been
  // provided, wrap the children in it
  if (Component) children = <Component>{children}</Component>;

  return Children.toArray(children).map((child) =>
    isValidElement<LinkProps>(child)
      ? cloneElement(child, { href, target: "_blank", rel: "noopener" })
      : child
  );
};

export default ExternalLink;
