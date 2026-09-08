"use client";

import Link from "next/link";
import { forwardRef, type ComponentProps } from "react";

type Props = ComponentProps<typeof Link>;

/**
 * Disable prefetch on Clerk-gated routes. Prefetching a protected page can
 * cache a redirect/empty RSC payload and render a blank main until refresh.
 */
export const DocumentLink = forwardRef<HTMLAnchorElement, Props>(
  function DocumentLink(props, ref) {
    return <Link ref={ref} {...props} prefetch={false} />;
  },
);
