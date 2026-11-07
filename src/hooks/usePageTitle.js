import { useEffect } from "react";

const SUFFIX = "Tan & Rahman Advocates & Solicitors";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : SUFFIX;
  }, [title]);
}
