import { NextRequest, NextResponse } from 'next/server';

// Interface for link objects
interface LinkObject {
  href: string;
  rel?: string;
  text?: string;
}

// Function to sanitize smart quotes and other problematic characters
function sanitizeQuotes(text: string): string {
  return text
    // Replace smart single quotes
    .replace(/[\u2018\u2019\u201A\u201B]/g, "'")
    // Replace smart double quotes
    .replace(/[\u201C\u201D\u201E\u201F]/g, '"')
    // Replace other quote-like characters
    .replace(/[\u00AB\u00BB]/g, '"') // Guillemets
    .replace(/[\u2039\u203A]/g, "'") // Single guillemets
    // Replace other problematic characters
    .replace(/[\u2013\u2014]/g, '-') // En dash and em dash
    .replace(/[\u2026]/g, '...') // Ellipsis
    .replace(/[\u00A0]/g, ' '); // Non-breaking space
}

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json({
        success: false,
        error: 'URL is required'
      }, { status: 400 });
    }
    
    console.log('[scrape-url-enhanced] Scraping with Firecrawl:', url);
    
    const FIRECRAWL_API_KEY = process.env.FIRECRAWL_API_KEY;
    if (!FIRECRAWL_API_KEY) {
      throw new Error('FIRECRAWL_API_KEY environment variable is not set');
    }
    
    // Make request to Firecrawl API with maxAge for 500% faster scraping
    const firecrawlResponse = await fetch('https://api.firecrawl.dev/v1/scrape', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${FIRECRAWL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url,
        formats: ['markdown', 'html', 'links', 'screenshot'],
        waitFor: 5000,
        timeout: 60000,
        blockAds: true,
        maxAge: 3600000, // Use cached data if less than 1 hour old (500% faster!)
        includeTags: ['img', 'picture', 'svg', 'video', 'audio', 'iframe', 'canvas'],
        onlyMainContent: false,
        // Removed unsupported Firecrawl v1 keys: includeHtml, includeRawHtml, extractorOptions
        actions: [
          {
            type: 'wait',
            milliseconds: 3000
          },
          {
            type: 'screenshot',
            fullPage: true
          }
        ]
      })
    });
    
    if (!firecrawlResponse.ok) {
      const error = await firecrawlResponse.text();
      throw new Error(`Firecrawl API error: ${error}`);
    }
    
    const data = await firecrawlResponse.json();
    
    if (!data.success || !data.data) {
      throw new Error('Failed to scrape content');
    }
    
    const { markdown, html, metadata, links, screenshot, rawHtml } = data.data;
    
    // Sanitize the markdown content
    const sanitizedMarkdown = sanitizeQuotes(markdown || '');
    
    // Extract structured data from the response
    const title = metadata?.title || '';
    const description = metadata?.description || '';
    
    // Filter links with explicit typing
    const images: LinkObject[] = Array.isArray(links) ? (links as LinkObject[]).filter((link: LinkObject) => /(jpg|jpeg|png|gif|svg|webp|bmp|ico)$/i.test(link.href)) : [];
    const stylesheets: LinkObject[] = Array.isArray(links) ? (links as LinkObject[]).filter((link: LinkObject) => link.rel === 'stylesheet' || link.href?.includes('.css')) : [];
    const fonts: LinkObject[] = Array.isArray(links) ? (links as LinkObject[]).filter((link: LinkObject) => link.href?.includes('font') || /(woff|woff2|ttf|otf|eot)$/i.test(link.href)) : [];
    
    // Extract additional assets from HTML using our custom extractor
    let extractedAssets = null;
    if (html) {
      try {
        const assetsResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/extract-assets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ html, url })
        });
        
        if (assetsResponse.ok) {
          const assetsData = await assetsResponse.json();
          if (assetsData.success) {
            extractedAssets = assetsData.assets;
          }
        }
      } catch (error) {
        console.warn('[scrape-url-enhanced] Failed to extract additional assets:', error);
      }
    }
    
    // Format content for AI with enhanced visual information
     const imagesList = images.length > 0 ? `
 
 IMAGES FOUND:
 ${images.map((img: LinkObject) => `- ${img.href} (alt: "${(img as any).text || 'N/A'}")`).join('\n')}` : '';
     const stylesheetsList = stylesheets.length > 0 ? `
 
 STYLESHEETS:
 ${stylesheets.map((css: LinkObject) => `- ${css.href}`).join('\n')}` : '';
     const fontsList = fonts.length > 0 ? `
 
 FONTS:
 ${fonts.map((font: LinkObject) => `- ${font.href}`).join('\n')}` : '';
     
     // Add extracted assets information
     const extractedImagesList = extractedAssets?.images?.length > 0 ? `
 
 EXTRACTED IMAGES:
 ${extractedAssets?.images?.map((img: { src: string; alt?: string; className?: string }) => `- ${img.src} (alt: "${img.alt}", class: "${img.className}")`).join('\n')}` : '';
     const backgroundImagesList = extractedAssets?.backgroundImages?.length > 0 ? `
 
 BACKGROUND IMAGES:
 ${extractedAssets?.backgroundImages?.map((bg: string) => `- ${bg}`).join('\n')}` : '';
     const colorPalette = extractedAssets?.colors?.length > 0 ? `
 
 COLOR PALETTE:
 ${extractedAssets.colors.slice(0, 10).join(', ')}` : '';
     const layoutStructure = extractedAssets?.layoutElements?.length > 0 ? `
 
 LAYOUT STRUCTURE:
 ${extractedAssets?.layoutElements?.map((el: { tag: string; className?: string; id?: string }) => `- <${el.tag}> ${el.className ? `class="${el.className}"` : ''} ${el.id ? `id="${el.id}"` : ''}`).join('\n')}` : '';
    
    const formattedContent = `
 Title: ${sanitizeQuotes(title)}
 Description: ${sanitizeQuotes(description)}
 URL: ${url}${imagesList}${stylesheetsList}${fontsList}${extractedImagesList}${backgroundImagesList}${colorPalette}${layoutStructure}
 
 Main Content:
 ${sanitizedMarkdown}
 
 RAW HTML STRUCTURE:
 ${rawHtml ? rawHtml.substring(0, 2000) + '...' : 'Not available'}
     `.trim();
    
    return NextResponse.json({
      success: true,
      url,
      content: formattedContent,
      structured: {
        title: sanitizeQuotes(title),
        description: sanitizeQuotes(description),
        content: sanitizedMarkdown,
        url,
        images: images,
        stylesheets: stylesheets,
        fonts: fonts,
        rawHtml: rawHtml,
        screenshot: screenshot,
        extractedAssets: extractedAssets
      },
      metadata: {
        scraper: 'firecrawl-enhanced',
        timestamp: new Date().toISOString(),
        contentLength: formattedContent.length,
        cached: data.data.cached || false,
        imagesCount: images.length,
        stylesheetsCount: stylesheets.length,
        fontsCount: fonts.length,
        hasScreenshot: !!screenshot,
        ...metadata
      },
      message: 'URL scraped successfully with enhanced visual content extraction'
    });
    
  } catch (error) {
    console.error('[scrape-url-enhanced] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}