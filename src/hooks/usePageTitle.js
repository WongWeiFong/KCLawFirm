import { useEffect } from "react";

const SUFFIX = "Kelly Chan Advocates & Solicitors";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${SUFFIX}` : SUFFIX;
  }, [title]);
}
