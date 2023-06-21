import { PortableText } from "@portabletext/react";
import type { PageCopy } from "~/routes/_dashboard/types";

export function RichTextField({ contentKey, richContent }: { contentKey: string, richContent?: PageCopy["richContent"] }) {
  const portableText = richContent?.find((c) => c.key === contentKey)?.value;
  if (!portableText) return null;
  
  return <PortableText value={portableText} />;
}