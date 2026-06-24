/* eslint-disable */
/* global WebImporter */
/**
 * Parser for carousel. Base: carousel.
 * Source: https://www.drpepper.com/ (saved copy)
 * 2-column table: row 1 = block name; each subsequent row = one slide
 * with [image cell, content cell]. Slide background images are carried on
 * the inline style background-image and converted to <img> so EDS optimizes them.
 */
export default function parse(element, { document }) {
  const slides = element.querySelectorAll(':scope > .dp-slide, :scope > div');
  const cells = [];

  slides.forEach((slide) => {
    // Image (mandatory, first cell): extract background-image URL from inline style
    let imgUrl = '';
    const style = slide.getAttribute('style') || '';
    const match = style.match(/url\((['"]?)(.*?)\1\)/i);
    if (match) imgUrl = match[2];

    let imageCell = '';
    const heading = slide.querySelector('h1, h2, h3');
    if (imgUrl) {
      const img = document.createElement('img');
      img.src = imgUrl;
      img.alt = heading ? heading.textContent.trim() : '';
      imageCell = img;
    }

    // Text content (second cell): title, body copy, then CTA(s)
    const contentCell = [];
    if (heading) contentCell.push(heading);
    slide.querySelectorAll(':scope > p').forEach((p) => {
      if (!p.querySelector('a')) contentCell.push(p);
    });
    Array.from(slide.querySelectorAll('a')).forEach((a) => contentCell.push(a));

    cells.push([imageCell, contentCell]);
  });

  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel', cells });
  element.replaceWith(block);
}
