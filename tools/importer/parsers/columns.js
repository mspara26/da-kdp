/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns. Base: columns.
 * Source: https://www.drpepper.com/ (saved copy)
 * 2-column table: row 1 = block name; row 2 = two cells (one per source column),
 * laid out side by side. Source uses paired text/image divs in either order.
 * Preserves heading, body copy, CTA link, and image with semantic markup.
 */
export default function parse(element, { document }) {
  let columns = Array.from(element.querySelectorAll(
    ':scope > .dp-promo-text, :scope > .dp-promo-image, :scope > .dp-content-text, :scope > .dp-content-image',
  ));

  // Fallback: any direct child divs
  if (columns.length < 2) {
    columns = Array.from(element.querySelectorAll(':scope > div'));
  }

  if (columns.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const row = columns.map((col) => {
    const cellContent = [];
    Array.from(col.childNodes).forEach((node) => {
      if (node.nodeType === 1) cellContent.push(node);
    });
    if (cellContent.length === 0) {
      const img = col.querySelector('img');
      if (img) cellContent.push(img);
    }
    return cellContent.length ? cellContent : '';
  });

  const cells = [row];
  const block = WebImporter.Blocks.createBlock(document, { name: 'columns', cells });
  element.replaceWith(block);
}
