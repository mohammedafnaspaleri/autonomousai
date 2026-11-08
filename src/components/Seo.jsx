import { Helmet } from "react-helmet-async";
import { useSite } from "@/lib/site";

export function Seo({ title, description }) {
  const { data, lang } = useSite();
  const siteTitle = data?.settings?.seo_title || "AUTONOMOUS — A Smarter Companion for Every Journey";
  const siteDesc = data?.settings?.seo_description || "An emerging technology company exploring new possibilities in intelligent AI and automation.";
  const fullTitle = title ? `${title} — AUTONOMOUS` : siteTitle;
  const desc = description || siteDesc;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <link rel="canonical" href={typeof window !== "undefined" ? window.location.href : "/"} />
      <link rel="alternate" hrefLang="en" href={typeof window !== "undefined" ? `${window.location.origin}/?lang=en` : "/"} />
      <link rel="alternate" hrefLang="de" href={typeof window !== "undefined" ? `${window.location.origin}/?lang=de` : "/"} />
      <link rel="alternate" hrefLang="es" href={typeof window !== "undefined" ? `${window.location.origin}/?lang=es` : "/"} />
      <link rel="alternate" hrefLang="fr" href={typeof window !== "undefined" ? `${window.location.origin}/?lang=fr` : "/"} />
      <link rel="alternate" hrefLang="x-default" href={typeof window !== "undefined" ? window.location.origin : "/"} />
      <html lang={lang} />
    </Helmet>
  );
}

export default Seo;
