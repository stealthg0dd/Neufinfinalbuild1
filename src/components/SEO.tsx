import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  schemaType?: 'WebSite' | 'WebPage' | 'Organization' | 'SoftwareApplication' | 'Article';
}

export function SEO({
  title = 'Neufin AI - Neural Twin Trading Platform | Eliminate Cognitive Bias',
  description = 'Trade without cognitive bias. Neufin AI\'s Neural Twin technology analyzes millions of market decisions to eliminate emotional trading and maximize your alpha. Google OAuth login, Plaid integration, and personalized AI insights.',
  keywords = 'AI trading, neural twin, cognitive bias detection, algorithmic trading, portfolio optimization, bias-free trading, Google OAuth, Plaid integration, real-time market analysis, AI financial advisor, behavioral finance, alpha generation',
  image = 'https://neufin.ai/og-image.png',
  url = 'https://neufin.ai',
  type = 'website',
  author = 'CTECH Ventures',
  publishedTime,
  modifiedTime,
  schemaType = 'WebSite'
}: SEOProps) {
  const siteUrl = 'https://neufin.ai';
  const fullUrl = url.startsWith('http') ? url : `${siteUrl}${url}`;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Schema.org structured data
  const getSchemaMarkup = () => {
    const baseSchema = {
      '@context': 'https://schema.org',
      '@type': schemaType,
    };

    switch (schemaType) {
      case 'WebSite':
        return {
          ...baseSchema,
          name: 'Neufin AI',
          alternateName: 'Neural Twin Trading Platform',
          url: siteUrl,
          description,
          author: {
            '@type': 'Organization',
            name: 'CTECH Ventures',
            url: 'https://neufin.ai/about'
          },
          potentialAction: {
            '@type': 'SearchAction',
            target: `${siteUrl}/search?q={search_term_string}`,
            'query-input': 'required name=search_term_string'
          },
          sameAs: [
            'https://www.linkedin.com/company/neufin-ai',
            'https://twitter.com/neufin_ai'
          ]
        };

      case 'Organization':
        return {
          ...baseSchema,
          name: 'Neufin AI',
          legalName: 'Neufin AI - A Unit of CTECH Ventures',
          url: siteUrl,
          logo: `${siteUrl}/logo.png`,
          description,
          foundingDate: '2024',
          founders: [
            {
              '@type': 'Person',
              name: 'Founder Name',
              jobTitle: 'CEO & Co-founder'
            }
          ],
          address: [
            {
              '@type': 'PostalAddress',
              addressLocality: 'Singapore',
              addressCountry: 'SG'
            },
            {
              '@type': 'PostalAddress',
              addressLocality: 'Estonia',
              addressCountry: 'EE'
            },
            {
              '@type': 'PostalAddress',
              addressLocality: 'Thailand',
              addressCountry: 'TH'
            },
            {
              '@type': 'PostalAddress',
              addressLocality: 'Vietnam',
              addressCountry: 'VN'
            },
            {
              '@type': 'PostalAddress',
              addressLocality: 'Dubai',
              addressRegion: 'UAE',
              addressCountry: 'AE'
            }
          ],
          contactPoint: {
            '@type': 'ContactPoint',
            email: 'info@neufin.ai',
            contactType: 'Customer Service',
            availableLanguage: ['English']
          },
          sameAs: [
            'https://www.linkedin.com/company/neufin-ai',
            'https://twitter.com/neufin_ai'
          ]
        };

      case 'SoftwareApplication':
        return {
          ...baseSchema,
          name: 'Neufin AI Neural Twin',
          applicationCategory: 'FinanceApplication',
          operatingSystem: 'Web, iOS, Android',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
            description: 'Free trial available'
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '4.8',
            ratingCount: '1247',
            bestRating: '5',
            worstRating: '1'
          },
          description,
          screenshot: fullImage,
          featureList: [
            'Google OAuth Authentication',
            'Plaid Bank Integration',
            'Real-time Bias Detection',
            'Neural Twin AI Analysis',
            'Portfolio Optimization',
            'Alpha Score Tracking',
            'Live Market Sentiment',
            'Personalized Dashboard'
          ]
        };

      case 'Article':
        return {
          ...baseSchema,
          headline: title,
          description,
          image: fullImage,
          datePublished: publishedTime,
          dateModified: modifiedTime || publishedTime,
          author: {
            '@type': 'Organization',
            name: author
          },
          publisher: {
            '@type': 'Organization',
            name: 'Neufin AI',
            logo: {
              '@type': 'ImageObject',
              url: `${siteUrl}/logo.png`
            }
          },
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': fullUrl
          }
        };

      default:
        return {
          ...baseSchema,
          name: title,
          description,
          url: fullUrl,
          image: fullImage
        };
    }
  };

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Neufin AI" />
      <meta property="og:locale" content="en_US" />
      
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      <meta property="article:author" content={author} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />
      <meta name="twitter:creator" content="@neufin_ai" />
      <meta name="twitter:site" content="@neufin_ai" />

      {/* Additional Meta Tags */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
      <meta name="theme-color" content="#A020F0" />
      <meta name="msapplication-TileColor" content="#A020F0" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="format-detection" content="telephone=no" />

      {/* AI Crawlers Specific */}
      <meta name="ai-indexable" content="true" />
      <meta name="chatgpt-indexable" content="true" />
      <meta name="perplexity-indexable" content="true" />
      <meta name="claude-indexable" content="true" />

      {/* Performance Hints */}
      <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://gpczchjipalfgkfqamcu.supabase.co" crossOrigin="anonymous" />

      {/* Schema.org JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(getSchemaMarkup())}
      </script>

      {/* Additional Business Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FinancialService",
          "name": "Neufin AI",
          "description": description,
          "url": siteUrl,
          "logo": `${siteUrl}/logo.png`,
          "image": fullImage,
          "priceRange": "Free Trial Available",
          "telephone": "+65-XXXX-XXXX",
          "email": "info@neufin.ai",
          "areaServed": [
            {
              "@type": "Country",
              "name": "Singapore"
            },
            {
              "@type": "Country",
              "name": "Estonia"
            },
            {
              "@type": "Country",
              "name": "Thailand"
            },
            {
              "@type": "Country",
              "name": "Vietnam"
            },
            {
              "@type": "Country",
              "name": "United Arab Emirates"
            },
            {
              "@type": "Country",
              "name": "Global"
            }
          ],
          "serviceType": "AI-Powered Trading Platform",
          "provider": {
            "@type": "Organization",
            "name": "CTECH Ventures"
          }
        })}
      </script>

      {/* BreadcrumbList Schema */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Home",
              "item": siteUrl
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": title.split('|')[0].trim(),
              "item": fullUrl
            }
          ]
        })}
      </script>
    </Helmet>
  );
}
