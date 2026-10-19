/**
 * Single source of truth for app routes.
 * Consumed by router.js (matching, titles) and app (nav maps, nav items).
 *
 * Fields:
 *   path       - URL pattern (use :param for dynamic segments). Logical, no app prefix.
 *   component  - LWC component name (must be registered in app.js ROUTE_COMPONENTS)
 *   title      - Document title (string or (params) => string)
 *   navPage    - Id for nav active state and navigate({ page }) (omit to hide from nav)
 *   navLabel   - Label shown in nav bar and in the Console object switcher
 *   navPath    - Optional; for dynamic routes, path used in nav links (e.g. /users/42)
 *   navHighlight - Optional; nav page id to highlight when this route is active (for child routes that don't create a tab)
 */

export const routes = [
  {
    path: '/',
    component: 'page-home',
    title: 'Home',
    navPage: 'home',
    navLabel: 'Home',
  },
  {
    path: '/icons',
    component: 'page-icon-test',
    title: 'Icons',
    navPage: 'icons',
    navLabel: 'Icons',
  },
  {
    path: '/contacts',
    component: 'page-contacts',
    title: 'Contacts',
    navPage: 'contacts',
    navLabel: 'Contacts',
  },
  {
    path: '/pos',
    component: 'page-pos',
    title: 'Program of Study',
    navPage: 'pos',
    navLabel: 'Program of Study',
  },
    {
    path: '/pos-courses',
    component: 'page-posCourses',
    title: 'Program of Study',
    navPage: 'posCourses',
    navLabel: 'Program of Study',
  },
      {
    path: '/pos-committee',
    component: 'page-posCommittee',
    title: 'Committee',
    navPage: 'posCommittee',
    navLabel: 'Committee',
  },
  {
    path: '/contacts/:id',
    component: 'page-contact-detail',
    title: (params) => `Contact ${params.id}`,
    navHighlight: 'contacts',
  },
  {
    path: '/',
    component: 'page-builder',
    title: 'Builder',
    app: 'builder',
  },
];
