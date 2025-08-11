import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(request: NextRequest) {
  try {
    const { html, url } = await request.json();
    
    if (!html) {
      return NextResponse.json({
        success: false,
        error: 'HTML content is required'
      }, { status: 400 });
    }
    
    const $ = cheerio.load(html);
    const baseUrl = url ? new URL(url).origin : '';
    
    // Extract all images with their attributes
    const images: any[] = [];
    $('img').each((_, element) => {
      const $img = $(element);
      const src = $img.attr('src');
      const alt = $img.attr('alt') || '';
      const className = $img.attr('class') || '';
      const width = $img.attr('width');
      const height = $img.attr('height');
      
      if (src) {
        const fullUrl = src.startsWith('http') ? src : (baseUrl ? new URL(src, baseUrl).href : src);
        images.push({
          src: fullUrl,
          alt,
          className,
          width,
          height,
          originalSrc: src
        });
      }
    });
    
    // Extract background images from CSS
    const backgroundImages: string[] = [];
    $('[style*="background-image"]').each((_, element) => {
      const style = $(element).attr('style') || '';
      const bgMatch = style.match(/background-image:\s*url\(['"]?([^'"\)]+)['"]?\)/);
      if (bgMatch && bgMatch[1]) {
        const bgUrl = bgMatch[1].startsWith('http') ? bgMatch[1] : (baseUrl ? new URL(bgMatch[1], baseUrl).href : bgMatch[1]);
        backgroundImages.push(bgUrl);
      }
    });
    
    // Extract CSS links
    const stylesheets: any[] = [];
    $('link[rel="stylesheet"]').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href');
      if (href) {
        const fullUrl = href.startsWith('http') ? href : (baseUrl ? new URL(href, baseUrl).href : href);
        stylesheets.push({
          href: fullUrl,
          originalHref: href
        });
      }
    });
    
    // Extract font links
    const fonts: any[] = [];
    $('link').each((_, element) => {
      const $link = $(element);
      const href = $link.attr('href') || '';
      const rel = $link.attr('rel') || '';
      
      if (href && (rel.includes('font') || href.includes('font') || /\.(woff|woff2|ttf|otf|eot)$/i.test(href))) {
        const fullUrl = href.startsWith('http') ? href : (baseUrl ? new URL(href, baseUrl).href : href);
        fonts.push({
          href: fullUrl,
          rel,
          originalHref: href
        });
      }
    });
    
    // Extract inline styles
    const inlineStyles: string[] = [];
    $('style').each((_, element) => {
      const styleContent = $(element).html();
      if (styleContent) {
        inlineStyles.push(styleContent);
      }
    });
    
    // Extract color palette from CSS
    const colors: string[] = [];
    const colorRegex = /#[0-9a-fA-F]{3,6}|rgb\([^)]+\)|rgba\([^)]+\)|hsl\([^)]+\)|hsla\([^)]+\)/g;
    
    inlineStyles.forEach(style => {
      const matches = style.match(colorRegex);
      if (matches) {
        colors.push(...matches);
      }
    });
    
    // Extract layout structure
    const layoutElements: any[] = [];
    $('header, nav, main, section, article, aside, footer').each((_, element) => {
      const $el = $(element);
      const tagName = (element as any).tagName || (element as any).name || 'unknown';
      layoutElements.push({
        tag: tagName.toLowerCase(),
        className: $el.attr('class') || '',
        id: $el.attr('id') || ''
      });
    });
    
    return NextResponse.json({
      success: true,
      assets: {
        images,
        backgroundImages,
        stylesheets,
        fonts,
        inlineStyles,
        colors: [...new Set(colors)], // Remove duplicates
        layoutElements
      },
      metadata: {
        extractor: 'cheerio-enhanced',
        timestamp: new Date().toISOString(),
        imagesCount: images.length,
        backgroundImagesCount: backgroundImages.length,
        stylesheetsCount: stylesheets.length,
        fontsCount: fonts.length,
        colorsCount: colors.length,
        layoutElementsCount: layoutElements.length
      },
      message: 'Assets extracted successfully from HTML content'
    });
    
  } catch (error) {
    console.error('[extract-assets] Error:', error);
    return NextResponse.json({
      success: false,
      error: (error as Error).message
    }, { status: 500 });
  }
}