import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CrawelDetectionService {
  private botUserAgents = [
    'googlebot', 'bingbot', 'slurp', 'duckduckbot', 'baiduspider',
    'yandexbot', 'facebookexternalhit', 'twitterbot', 'linkedinbot',
    'whatsapp', 'telegrambot', 'discordbot'
  ];

  isCrawler(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    return this.botUserAgents.some(bot => userAgent.includes(bot));
  }

  handleCrawlerRedirect(blog: any) {
    if (this.isCrawler()) {
      const queryParams = `?title=${encodeURIComponent(blog.blog.post_title)}&description=${encodeURIComponent(blog.blog.post_content)}&image=${encodeURIComponent(blog.blog.post_image)}`;
      window.location.href = `/assets/static-details.html${queryParams}`;
    }
  }
}
