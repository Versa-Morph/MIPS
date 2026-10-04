export function getAssetPath(path: string): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) {
    return path;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // Normalize: if path already has /MIPS prefix, strip it first to avoid duplicate prefixes
  const normalized = cleanPath.startsWith("/MIPS/")
    ? cleanPath.slice(5)
    : cleanPath === "/MIPS"
    ? "/"
    : cleanPath;

  // 1. Explicit environment variable takes precedence
  if (process.env.NEXT_PUBLIC_BASE_PATH) {
    return `${process.env.NEXT_PUBLIC_BASE_PATH}${normalized}`;
  }

  // 2. Browser runtime auto-detection for GitHub Pages (/MIPS subpath)
  if (
    typeof window !== "undefined" &&
    (window.location.pathname === "/MIPS" || window.location.pathname.startsWith("/MIPS/"))
  ) {
    return `/MIPS${normalized}`;
  }

  return normalized;
}
