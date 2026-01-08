"use client";
import { ComponentProps } from "react";

import { Link as NavLink } from "@/config/i18n/navigation";

type Props = ComponentProps<typeof NavLink> & {};

export default function Link(props: Props) {
  return <NavLink {...props} />;
}
