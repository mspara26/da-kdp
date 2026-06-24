/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: drpepper sections.
 * Inserts section breaks (<hr>) and Section Metadata blocks based on the
 * template sections in page-templates.json. Runs in afterTransform only.
 * Section selectors come from the captured drpepper.com homepage DOM.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName !== H.after) return;

  const sections = payload?.template?.sections;
  if (!Array.isArray(sections) || sections.length < 2) return;

  // Resolve the first DOM element for each section using its selector(s).
  const resolveEl = (selector) => {
    const selectors = Array.isArray(selector) ? selector : [selector];
    for (const sel of selectors) {
      const found = element.querySelector(sel);
      if (found) return found;
    }
    return null;
  };

  // Process in reverse so insertions don't disturb earlier positions.
  for (let i = sections.length - 1; i >= 0; i -= 1) {
    const section = sections[i];
    const sectionEl = resolveEl(section.selector);
    if (!sectionEl) continue;

    // Section Metadata block (only when a style is set)
    if (section.style) {
      const metaBlock = WebImporter.Blocks.createBlock(document, {
        name: 'Section Metadata',
        cells: { style: section.style },
      });
      sectionEl.after(metaBlock);
    }

    // Section break before each non-first section
    if (i > 0) {
      const hr = document.createElement('hr');
      sectionEl.before(hr);
    }
  }
}
