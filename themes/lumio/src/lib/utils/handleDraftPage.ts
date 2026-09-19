/**
 * Handles draft pages by returning a 404 response if the page is marked as draft in frontmatter.
 * - Sets response to 404 if `draft` is true, excluding it from production and development output.
 * - Optionally excludes draft pages from the sitemap.
 *
 * @param {PageData} pageData - The page's frontmatter data object
 * @param {boolean} [isProd] - Optional injectable production flag, primarily for tests. Falls
 *   back to the build-time `import.meta.env.PROD` read when omitted, which is how all
 *   production call sites use this function.
 * @returns {Response | undefined} A 404 Response if draft is true; otherwise undefined.
 */
function handleDraftPage(pageData: any, isProd?: boolean): Response | undefined {
  const effectiveIsProd = isProd ?? Boolean(import.meta.env && import.meta.env.PROD);
  if (pageData.draft && effectiveIsProd) {
    // Return a 404 response to exclude the page from `dist` folder output
    return new Response(null, {
      status: 404,
      statusText: "Not Found",
    });
  }
  // Return undefined if the page is not a draft or in development mode
  return undefined;
}

export default handleDraftPage;
