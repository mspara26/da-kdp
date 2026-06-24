/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: drpepper cleanup.
 * Removes non-authorable Salesforce LWR site chrome (header, footer, nav,
 * modals, toasts, hidden regions) and tracking/script elements.
 * Selectors taken from the captured drpepper.com homepage DOM.
 */
const H = { before: 'beforeTransform', after: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === H.before) {
    // Overlays / dialogs / toasts that would interfere with parsing
    WebImporter.DOMUtils.remove(element, [
      'c-kdp-dialog',
      'c-kdp-toast',
      'c-kdp-alert-component',
      '.slds-modal',
      '.slds-backdrop',
    ]);
  }
  if (hookName === H.after) {
    // Non-authorable global chrome and non-content elements
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      'c-dp-theme-header',
      'c-kdp-global-footer',
      'c-dp-nav-menu',
      'community_layout-hidden-region',
      'experience-data-layer-object',
      'script',
      'style',
      'noscript',
      'iframe',
      'link',
      'svg',
    ]);
  }
}
