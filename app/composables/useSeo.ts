import { type UseSeoMetaInput } from '@unhead/vue'
import { trimFirst } from '~/src/util/util'

export interface SeoMetadata {
    /**
     * Relative path to the page
     */
    path: string
    /**
     * Title of the page or titles up to and including this page
     */
    title?: string|string[]
    /**
     * The description of the page (recommended ~155 characters)
     */
    description: string
    /**
     * The type of the webpage, default is "website"
     */
    type?: 'website'|'article',

    /**
     * Image to show with the page
     */
    image?: {
        url: string,
        type: 'image/jpeg'|'image/png'|'image/gif'
        width?: number|string,
        height?: number|string,
        alt?: string
    }

    /**
     * Google/other breadcrumbs for the page (auto-generated)
     */
    breadcrumbs?: boolean

    /**
     * Article data if page is an article
     */
    article?: {
        datePublished: Date,
        dateModified: Date,
        author?: string[]
    },

    /**
     * Organization panel on Google, use this only on the homepage!
     */
    organization?: {
        logo: string,
        /**
         * Concise description of the organization
         */
        description: string,
        /**
         * List of urls that represent this organization on different websites (such as social media)
         */
        sameAs: string[],
        email: string,
        phone: string,
        /**
         * Comma separated address (street, locality, country, region of country, postal code)
         */
        address: string
    }
}

export const useSeo = (meta: SeoMetadata) => {
    const scripts: { type: string, children: any }[] = [];
    const seoMeta: UseSeoMetaInput = {};

    seoMeta.ogUrl = useEnv('http') + '/' + trimFirst('/', meta.path);
    
    let composedTitle = '';
    if (!meta.title)
        composedTitle = useEnv('title') as string;
    else {
        if (Array.isArray(meta.title))
            composedTitle = [...meta.title].reverse().join(' | ') + " — " + useEnv('title');
        else
            composedTitle = meta.title  + " — " + useEnv('title');
    }

    seoMeta.title = composedTitle;
    seoMeta.ogTitle = composedTitle;
    seoMeta.twitterTitle = composedTitle;
    
    seoMeta.description = meta.description;
    seoMeta.ogDescription = meta.description;
    seoMeta.twitterDescription = meta.description;
    
    seoMeta.contentType = 'text/html; charset=utf-8';
    seoMeta.ogType = meta.type ?? 'website';

    if (meta.image) {
        let absImageUrl = useEnv('http') + '/' + trimFirst('/', meta.image.url);
        seoMeta.ogImage = {
            url: absImageUrl,
            secureUrl: absImageUrl,
            type: meta.image.type ?? undefined,
            width: meta.image.width ?? undefined,
            height: meta.image.height ?? undefined,
            alt: meta.image.alt ?? undefined,
        }
    }

    if (meta.article) {
        if (meta.article.author) {
            seoMeta.articleAuthor = meta.article.author;
        }
        else
            seoMeta.articleAuthor = [useEnv('title') as string];
        seoMeta.articlePublishedTime = meta.article.datePublished.toISOString();
        seoMeta.articleModifiedTime = meta.article.dateModified.toISOString();
        
        const jsonLd: any = {
            "@context": "https://schema.org",
            "@type": "NewsArticle",
            headline: Array.isArray(meta.title) ? meta.title[meta.title.length - 1] : meta.title,
            datePublished: meta.article.datePublished.toISOString(),
            dateModified: meta.article.dateModified.toISOString()
        }

        if (meta.image)
            jsonLd.image = [ useEnv('http') + '/' + trimFirst('/', meta.image.url) ]

        if (meta.article.author) {
            jsonLd.author = meta.article.author.map(a => ({
                "@type": "Person",
                name: a
            }));
        }
        else {
            jsonLd.author = {
                "@type": "Organization",
                name: useEnv('title'),
                url: useEnv('http')
            }
        }

        scripts.push({type: 'application/ld+json', children: JSON.stringify(jsonLd)});
    }

    let pathComponents = meta.path.split('/').filter(Boolean);
    if (meta.breadcrumbs && Array.isArray(meta.title) && meta.title.length == pathComponents.length) {
        const jsonLd: any = {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: []
        }

        for (let i = 0; i < pathComponents.length; i++) {
            const item: any = {
                "@type": "ListItem",
                position: i + 1,
                name: meta.title[i],
            };

            if (i != pathComponents.length - 1)
                item.item = useEnv('http') + '/' + pathComponents.filter((_, j) => j <= i).join('/');

            jsonLd.itemListElement.push(item);
        }

        scripts.push({type: 'application/ld+json', children: JSON.stringify(jsonLd)});
    }

    if (meta.organization) {
        const addressBreakdown = ['streetAddress', 'addressLocality', 'addressCountry', 'addressRegion', 'postalCode']
        const splitAddress = meta.organization.address.split(',').map(c => c.trim());
        const schemaAddress: any = {
            "@type": "PostalAddress"
        };
        addressBreakdown.filter((_, i) => splitAddress.length > i)
                        .map((addrComp, i) => [addrComp, splitAddress[i]])
                        .forEach(([key, value]) => schemaAddress[key] = value)

        const jsonLd: any = {
            "@context": "https://schema.org",
            "@type": "Organization",
            url: useEnv('http'),
            sameAs: meta.organization.sameAs,
            logo: useEnv('http') + '/' + trimFirst('/', meta.organization.logo),
            name: useEnv('title'),
            description: meta.organization.description,
            email: meta.organization.email,
            telephone: meta.organization.phone,
            address: schemaAddress
        }

        scripts.push({type: 'application/ld+json', children: JSON.stringify(jsonLd)});
    }

    useSeoMeta(seoMeta);
    useHead({
        script: scripts
    });
}