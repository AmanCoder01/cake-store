import { useEffect } from 'react';

const Meta = ({ title, description, keywords, schema }) => {
  useEffect(() => {
    // 1. Title optimization
    document.title = title 
      ? `${title} | Cake Baker's Varanasi - Best Cake Shop` 
      : "Cake Baker's Varanasi | Best Cake Shop & Online Delivery in Varanasi";
    
    // 2. Meta Description optimization
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute(
      'content', 
      description || 'Looking for the best cake shop in Varanasi? Cake Baker\'s offers 100% fresh, eggless birthday cakes, customized wedding cakes & instant delivery near you in Varanasi. Order online now!'
    );

    // 3. Meta Keywords optimization (Varanasi-focused keywords for SEO)
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content', 
      keywords || 'cake in varanasi, nearby cake shop, best cake shop in varanasi, online cake delivery in varanasi, order cake online varanasi, birthday cake delivery varanasi, eggless cake varanasi, bakery near me varanasi'
    );

    // 4. Schema.org JSON-LD Script Injection
    let schemaScript = document.getElementById('seo-json-ld');
    if (schema) {
      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'seo-json-ld');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(schema);
    } else {
      // Inject standard Varanasi LocalBusiness/Bakery Schema if none provided
      const defaultLocalSchema = {
        "@context": "https://schema.org",
        "@type": "Bakery",
        "name": "Cake Baker's Varanasi",
        "image": "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80",
        "@id": `${window.location.origin}/#bakery`,
        "url": window.location.origin,
        "telephone": "+91 98765 43210",
        "priceRange": "₹₹",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Near Assi Ghat, Shivala",
          "addressLocality": "Varanasi",
          "postalCode": "221005",
          "addressRegion": "Uttar Pradesh",
          "addressCountry": "IN"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 25.2997,
          "longitude": 83.0076
        },
        "openingHoursSpecification": {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
          ],
          "opens": "09:00",
          "closes": "23:00"
        },
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+91 98765 43210",
          "contactType": "customer service",
          "areaServed": "Varanasi"
        }
      };

      if (!schemaScript) {
        schemaScript = document.createElement('script');
        schemaScript.setAttribute('id', 'seo-json-ld');
        schemaScript.setAttribute('type', 'application/ld+json');
        document.head.appendChild(schemaScript);
      }
      schemaScript.textContent = JSON.stringify(defaultLocalSchema);
    }

    // Cleanup
    return () => {
      const scriptToRemove = document.getElementById('seo-json-ld');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [title, description, keywords, schema]);

  return null;
};

export default Meta;
