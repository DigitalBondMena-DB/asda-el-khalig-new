import { NgClass, isPlatformBrowser } from '@angular/common';
import { Component, Input, Inject, PLATFORM_ID } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Contact } from '../../../core/interfaces/ISocialMedia';
import { SocialMediaService } from '../../../core/services/content/social-media.service';
import { StaticCategoriesService } from '../../../core/services/content/static-categories.service';

@Component({
  selector: 'app-founding-footer',
  imports: [RouterLink, NgClass],
  templateUrl: './founding-footer.component.html',
  styleUrl: './founding-footer.component.scss'
})
export class FoundingFooterComponent {
  @Input({ required: true }) isNational: boolean = false;

  socialLinks: { label: string; url: string; icon: string; alt: string }[] = [];

  constructor(
    private _StaticCategoriesService: StaticCategoriesService,
    private _SocialMediaService: SocialMediaService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  ngOnInit(): void {
    this.getSocialMediaLinks();
    this._StaticCategoriesService.increaseView().subscribe({
      next: (response) => { },
      error: (err) => console.warn('Failed to record visit on server.', err.message),
    });

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
            icon: !this.isNational
              ? './assets/images/social_meida_icons/facebook.svg'
              : './assets/images/national-day/FB.webp',
            alt: 'اصداء الخليج فيسبوك',
          },
          tweet_url: {
            label: 'Twitter',
            icon: !this.isNational
              ? './assets/images/social_meida_icons/x-twitter-brands-solid.svg'
              : './assets/images/national-day/x.webp',
            alt: 'اصداء الخليج اكس',
          },
          instgram_url: {
            label: 'Instagram',
            icon: !this.isNational
              ? './assets/images/social_meida_icons/instagram.svg'
              : './assets/images/national-day/IG.webp',
            alt: 'اصداء الخليج انستجرام',
          },
          tiktok_url: {
            label: 'TikTok',
            icon: !this.isNational
              ? './assets/images/social_meida_icons/tiktok.svg'
              : './assets/images/national-day/TikTok.webp',
            alt: 'اصداء الخليج تيك توك',
          },
          snapchat_url: {
            label: 'Snapchat',
            icon: !this.isNational
              ? './assets/images/social_meida_icons/snapchat.svg'
              : './assets/images/national-day/Snap.webp',
            alt: 'اصداء الخليج سناب شات',
          },
          telegram_url: {
            label: 'Telegram',
            icon: !this.isNational
              ? './assets/images/social_meida_icons/telegram.svg'
              : './assets/images/national-day/Telegram.webp',
            alt: 'اصداء الخليج تيليجرام',
          },
          watus_number: {
            label: 'WhatsApp',
            icon: !this.isNational
              ? './assets/images/social_meida_icons/whatsapp.svg'
              : './assets/images/national-day/WA.webp',
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
}
