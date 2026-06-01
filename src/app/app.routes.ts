import { Routes } from '@angular/router';

import { DetailsComponent } from './pages/blank-layout/categories/details/details.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/blank-layout/blank-layout.component').then(
        (c) => c.BlankLayoutComponent,
      ),
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/blank-layout/home/home.component').then(
            (c) => c.HomeComponent,
          ),
      },
      {
        path: 'archives',
        loadComponent: () =>
          import('./pages/blank-layout/categories/categories.component').then(
            (c) => c.CategoriesComponent,
          ),
        children: [
          {
            path: 'blogs/:id',
            loadComponent: () =>
              import('./pages/blank-layout/categories/blogs/blogs.component').then(
                (c) => c.BlogsComponent,
              ),
          },
          {
            path: 'article/:id',
            loadComponent: () =>
              import('./pages/blank-layout/categories/articles/articles.component').then(
                (c) => c.ArticlesComponent,
              ),
          },
          {
            path: 'search/:id',
            loadComponent: () =>
              import('./pages/blank-layout/categories/search-results/search-results.component').then(
                (c) => c.SearchResultsComponent,
              ),
          },
        ],
      },
      // detail
      // {
      //   path: 'archives/:id',
      //   loadComponent: () =>
      //     import(
      //       './pages/blank-layout/categories/details/details.component'
      //     ).then((c) => c.DetailsComponent),
      // },
      // {
      //   path: 'article/:id',
      //   loadComponent: () =>
      //     import(
      //       './pages/blank-layout/categories/details/details.component'
      //     ).then((c) => c.DetailsComponent),
      // },
      {
        path: 'archives/:id',
        component: DetailsComponent,
        // resolve:{article:articlesResolver}
      },
      {
        path: 'article/:id',
        component: DetailsComponent,
        // resolve:{article:articlesResolver}
      },
      {
        path: 'contact-us',
        loadComponent: () =>
          import('./pages/blank-layout/contact-us/contact-us.component').then(
            (c) => c.ContactUsComponent,
          ),
        data: {
          title: 'تواصل معنا | صحيفة أصداء الخليج',
          description: 'تواصل معنا | صحيفة أصداء الخليج',
        },
      },
      {
        path: 'about-us',
        loadComponent: () =>
          import('./pages/blank-layout/about-us/about-us.component').then(
            (c) => c.AboutUsComponent,
          ),
        data: {
          title: 'من نحن | صحيفة أصداء الخليج',
          description: 'من نحن | صحيفة أصداء الخليج',
        },
      },

      {
        path: 'administrative-structure',
        loadComponent: () =>
          import('./pages/blank-layout/administrative-structure/administrative-structure.component').then(
            (c) => c.AdministrativeStructureComponent,
          ),
        data: {
          title: 'الهيكلة الإدارية | صحيفة أصداء الخليج',
          description: 'الهيكلة الإدارية | صحيفة أصداء الخليج',
        },
      },
      {
        path: 'privacy-policy',
        loadComponent: () =>
          import('./pages/blank-layout/privacy-policy/privacy-policy.component').then(
            (c) => c.PrivacyPolicyComponent,
          ),
        data: {
          title: 'سياسة الخصوصية | صحيفة أصداء الخليج',
          description: 'سياسة الخصوصية | صحيفة أصداء الخليج',
        },
      },
    ],
  },


  {
    path: '**',
    loadComponent: () =>
      import('./core/components/not-found/not-found.component').then(
        (c) => c.NotFoundComponent,
      ),
  },
];
