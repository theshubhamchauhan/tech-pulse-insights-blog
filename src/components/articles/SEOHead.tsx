
import { Helmet } from "react-helmet";
import { SEOMetadata } from "@/lib/types";

interface SEOHeadProps {
  metadata: SEOMetadata;
  url: string;
}

const SEOHead = ({ metadata, url }: SEOHeadProps) => {
  return (
    <Helmet>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description || ""} />
      
      {metadata.keywords && (
        <meta name="keywords" content={metadata.keywords} />
      )}
      
      {metadata.canonicalUrl ? (
        <link rel="canonical" href={metadata.canonicalUrl} />
      ) : (
        <link rel="canonical" href={url} />
      )}
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={metadata.ogType || "article"} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description || ""} />
      <meta property="og:url" content={metadata.canonicalUrl || url} />
      
      {metadata.ogImage && (
        <meta property="og:image" content={metadata.ogImage} />
      )}
      
      {/* Twitter */}
      <meta name="twitter:card" content={metadata.twitterCard || "summary_large_image"} />
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description || ""} />
      
      {metadata.ogImage && (
        <meta name="twitter:image" content={metadata.ogImage} />
      )}
      
      {/* Additional structured data for articles */}
      {metadata.ogType === "article" && (
        <script type="application/ld+json">{`
          {
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "${metadata.title}",
            "description": "${metadata.description || ''}",
            "image": "${metadata.ogImage || ''}",
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "${metadata.canonicalUrl || url}"
            }
          }
        `}</script>
      )}
    </Helmet>
  );
};

export default SEOHead;
