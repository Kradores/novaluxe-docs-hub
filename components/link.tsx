"use client";
import { ComponentProps } from "react";

import { Link as NavLink } from "@/config/i18n/navigation";
import { validateRote } from "@/lib/utils";

type Props = ComponentProps<typeof NavLink> & {};

export default function Link(props: Props) {
  validateRote(props.href as string);
  return <NavLink {...props} />;
}
