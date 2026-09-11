import { Children, type ReactElement, type ReactNode } from "react";
import { Link as TanLink, useNavigate, useRouterState } from "@tanstack/react-router";

export function Link({
  href,
  to,
  className,
  children,
}: {
  href?: string;
  to?: string;
  className?: string;
  children?: ReactNode;
}) {
  const dest = to ?? href ?? "/";
  return (
    <TanLink to={dest as never} className={className}>
      {children}
    </TanLink>
  );
}

export function useLocation(): [string, (path: string) => void] {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  return [
    pathname,
    (path: string) => {
      void navigate({ to: path as never });
    },
  ];
}

function matchPath(path: string, pattern: string) {
  if (pattern.includes(":")) {
    const expected = pattern.split("/");
    const actual = path.split("/");
    if (expected.length !== actual.length) return false;
    return expected.every((segment, index) => segment.startsWith(":") || segment === actual[index]);
  }
  return path === pattern;
}

export function useRoute(pattern: string): [boolean, { id?: string } | undefined] {
  const [path] = useLocation();
  if (!matchPath(path, pattern)) return [false, undefined];
  if (pattern.includes(":id")) {
    const parts = path.split("/");
    return [true, { id: parts[parts.length - 1] }];
  }
  return [true, undefined];
}

export function Route({ children }: { path?: string; children?: ReactNode }) {
  return <>{children}</>;
}

export function Switch({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const items = Children.toArray(children) as ReactElement<{ path?: string; children?: ReactNode }>[];
  let fallback: ReactNode = null;
  for (const item of items) {
    const pattern = item.props.path;
    if (!pattern) {
      fallback = item;
      continue;
    }
    if (matchPath(path, pattern)) return item;
  }
  return <>{fallback}</>;
}
