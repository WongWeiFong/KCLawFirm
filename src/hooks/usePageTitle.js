import { useEffect } from "react";
import { FULL } from "../data/content.js";

export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${FULL}` : FULL;
  }, [title]);
}
