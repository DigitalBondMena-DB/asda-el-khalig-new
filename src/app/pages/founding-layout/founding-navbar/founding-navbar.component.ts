import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Contact } from '../../../core/interfaces/ISocialMedia';
import { SocialMediaService } from '../../../core/services/content/social-media.service';

@Component({
  selector: 'app-founding-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule, RouterLinkActive, NgClass],
  templateUrl: './founding-navbar.component.html',
  styleUrl: './founding-navbar.component.scss',
})
export class FoundingNavbarComponent {
  @Input({ required: true }) isNational: boolean = false;
  nowDate = new Date();
  searchResult: string = '';
  socialLinks: { label: string; url: string; icon: string; alt: string }[] = [];

  constructor(
    private _Router: Router,
    private _SocialMediaService: SocialMediaService
  ) {}

  ngOnInit(): void {
    this.getSocialMediaLinks();
  }

  searchResults(searchResult: string): void {
    if (searchResult.length > 0) {
      this._Router.navigate([`/archives/search`, searchResult]);
    }
  }
  getSocialMediaLinks(): void {
    this._SocialMediaService.getSocialMediaLinks().subscribe({
      next: (response) => {
        const contact = response?.contact as Contact;
        const linksMapping: Record<
          string,
          { label: string; icon: string; alt: string }
        > = {
          face_url: {
            label: 'Facebook',
            icon: './assets/images/social_meida_icons/facebook.svg',
            alt: 'اصداء الخليج فيسبوك',
          },
          tweet_url: {
            label: 'Twitter',
            icon: './assets/images/social_meida_icons/x-twitter-brands-solid.svg',
            alt: 'اصداء الخليج اكس',
          },
          instgram_url: {
            label: 'Instagram',
            icon: './assets/images/social_meida_icons/instagram.svg',
            alt: 'اصداء الخليج انستجرام',
          },
          tiktok_url: {
            label: 'TikTok',
            icon: './assets/images/social_meida_icons/tiktok.svg',
            alt: 'اصداء الخليج تيك توك',
          },
          snapchat_url: {
            label: 'Snapchat',
            icon: './assets/images/social_meida_icons/snapchat.svg',
            alt: 'اصداء الخليج سناب شات',
          },
          telegram_url: {
            label: 'Telegram',
            icon: './assets/images/social_meida_icons/telegram.svg',
            alt: 'اصداء الخليج تيليجرام',
          },
          watus_number: {
            label: 'WhatsApp',
            icon: './assets/images/social_meida_icons/whatsapp.svg',
            alt: 'اصداء الخليج واتساب',
          },
        };
        // Filter non-null social media links
        if (contact) {
          for (const [key, value] of Object.entries(contact)) {
            this.socialLinks.push({
              url: value as string,
              ...linksMapping[key],
            });
            // if (value !== 'null' && linksMapping[key]) {
            //   this.socialLinks.push({
            //     url: value as string,
            //     ...linksMapping[key],
            //   });
            // }
          }
        }
      },
    });
  }
  categories = [
    { router: '/', id: null, name: 'الرئيسية' },
    { router: '/archives/blogs', id: '01', name: 'أخبار محلية' },
    { router: '/archives/blogs', id: '02', name: 'أخبار العالم' },
    { router: '/archives/blogs', id: '03', name: 'الرياضة' },
    { router: '/archives/blogs', id: 'f', name: 'ثقافة وفن' },
    { router: '/archives/blogs', id: '04', name: 'الاقتصاد' },
    { router: '/archives/blogs', id: '05', name: 'التعليم' },
    { router: '/archives/blogs', id: '08', name: 'المقالات' },
    { router: '/archives/blogs', id: 'i', name: 'تحقيقات' },
    { router: '/archives/blogs', id: '09', name: 'أخبار المجتمع' },
    { router: '/archives/blogs', id: '07', name: 'دراسات وأبحاث' },
    { router: '/archives/blogs', id: '11', name: 'كاريكاتير' },
    { router: '/archives/blogs', id: 'g', name: 'الصحة والحياة' },
    { router: '/archives/blogs', id: '06', name: 'علوم وتكنولوجيا' },
    { router: '/archives/blogs', id: 'h', name: 'وقائع أمنية' },
    { router: '/archives/blogs', id: 'y', name: 'منوعات' },
    { router: '/founding-day', id: null, name: 'يوم التأسيس' },
    { router: '/archives/blogs', id: '10', name: 'زاوية رئيس التحرير' },
  ];
}
