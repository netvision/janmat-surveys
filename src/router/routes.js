const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue'), meta: { requiresAuth: true } },
      {
        path: '/user-admin',
        component: () => import('pages/UserAdminPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/surveys',
        component: () => import('pages/SurveysPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/questions/:surveyId', // Dynamic route with surveyId
        component: () => import('pages/QuestionsPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/response/:surveyId', // Dynamic route with surveyId
        component: () => import('pages/ResponsePage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: '/login',
        component: () => import('pages/LoginPage.vue'),
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
