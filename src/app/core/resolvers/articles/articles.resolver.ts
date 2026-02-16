import { ResolveFn } from '@angular/router';
import { IBlog } from '../../../core/interfaces/IBlog';
import { inject } from '@angular/core';
import { CategoriesService } from '../../services/content/categories.service';
import { CrawelDetectionService } from '../../services/seo/crawel-detection.service';
import { Meta, Title } from '@angular/platform-browser';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export const articlesResolver: ResolveFn<IBlog | null> = (route, state) => {
  const categoriesService = inject(CategoriesService);
  const crawelDetectionService = inject(CrawelDetectionService);
  const metaService = inject(Meta);
  const titleService = inject(Title);

  const blogId = route.paramMap.get('id')!;

  return categoriesService.getBlogById(blogId).pipe(
    tap((blog: IBlog | null) => {
      if (blog) {
        // 1️⃣ Update meta tags for normal users
        titleService.setTitle(blog.blog.post_title);
        metaService.updateTag({ name: 'description', content: blog.blog.post_content });
        metaService.updateTag({ property: 'og:title', content: blog.blog.post_title });
        metaService.updateTag({ property: 'og:description', content: blog.blog.post_content });
        metaService.updateTag({ property: 'og:image', content: blog.blog.post_image });
        metaService.updateTag({ property: 'og:url', content: window.location.href });
        metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        metaService.updateTag({ name: 'twitter:title', content: blog.blog.post_title });
        metaService.updateTag({ name: 'twitter:description', content: blog.blog.post_content });
        metaService.updateTag({ name: 'twitter:image', content: blog.blog.post_image });

        // 2️⃣ Redirect crawlers to static HTML page
        crawelDetectionService.handleCrawlerRedirect(blog);
      }
    }),
    catchError(() => of(null))
  );
};
