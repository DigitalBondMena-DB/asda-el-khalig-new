import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SocialMediaService } from '../../../../core/services/content/social-media.service';
import { SocialMediaLinksService } from '../../../services/social-media-links.service';
import { IUpdateSocialLinks } from '../../../../core/interfaces/ISocialMedia';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';

@Component({
  selector: 'app-yout-ube-control',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    MessagesModule,
    ToastModule,
    SafeHtmlPipe,
  ],
  templateUrl: './yout-ube-control.component.html',
  styleUrl: './yout-ube-control.component.scss',
  providers: [MessageService],
})
export class YoutUbeControlComponent {
  socialMediaLinks: any[] = [];
  originalLinks: any = {};
  isLoading: boolean = false;
  constructor(
    private _SocialMediaService: SocialMediaLinksService,
    private MessageService: MessageService
  ) {}

  ngOnInit() {
    // Fetch social media links from the service
    this._SocialMediaService.getSocialMediaLinks().subscribe((response) => {
      if (response && response.contact) {
        this.socialMediaLinks = this.convertResponseToLinks(response.contact);
        this.originalLinks = JSON.parse(JSON.stringify(this.socialMediaLinks));
      }
    });
  }

  // Convert response to editable links array
  convertResponseToLinks(contact: any): any[] {
    return [
      {
        key: 'tweet_url',
        label: 'تويتر',
        icon: 'pi-twitter',
        url: contact.tweet_url === 'null' ? '' : contact.tweet_url,
      },
      {
        key: 'snapchat_url',
        label: 'سناب شات',
        icon: 'pi-comment',
        url: contact.snapchat_url === 'null' ? '' : contact.snapchat_url,
      },
      {
        key: 'instgram_url',
        label: 'إنستجرام',
        icon: 'pi-instagram',
        url: contact.instgram_url === 'null' ? '' : contact.instgram_url,
      },
      {
        key: 'watus_number',
        label: 'واتساب',
        icon: 'pi-whatsapp',
        url: contact.watus_number === 'null' ? '' : contact.watus_number,
      },
      {
        key: 'face_url',
        label: 'فيسبوك',
        icon: 'pi-facebook',
        url: contact.face_url === 'null' ? '' : contact.face_url,
      },
      {
        key: 'youtube_url',
        label: 'يوتيوب',
        icon: 'pi-youtube',
        url: contact.youtube_url === 'null' ? '' : contact.youtube_url,
      },
      {
        key: 'youtube_embedded',
        label: 'يوتيوب فيديو الرئيسية',
        icon: 'pi-youtube',
        url:
          contact.youtube_embedded === 'null' ? '' : contact.youtube_embedded,
      },
      {
        key: 'tiktok_url',
        label: 'تيك توك',
        icon: 'pi-play',
        url: contact.tiktok_url === 'null' ? '' : contact.tiktok_url,
      },
      {
        key: 'telegram_url',
        label: 'تليجرام',
        icon: 'pi-send',
        url: contact.telegram_url === 'null' ? '' : contact.telegram_url,
      },
      {
        key: 'phone_number',
        label: 'رقم الهاتف',
        icon: 'pi-phone',
        url: contact.phone_number === 'null' ? '' : contact.phone_number,
      },
      {
        key: 'location',
        label: 'الموقع',
        icon: 'pi-map-marker',
        url: contact.location === 'null' ? '' : contact.location,
      },
      {
        key: 'main_email',
        label: 'البريد الإلكتروني',
        icon: 'pi-envelope',
        url: contact.main_email === 'null' ? '' : contact.main_email,
      },
    ];
  }

  // Save changes by sending the full updated object
  saveChanges() {
    this.isLoading = true;
    const updatedLinks = this.convertLinksToRequestBody(this.socialMediaLinks);
    this._SocialMediaService
      .updateSocialMediaLinks(updatedLinks)
      .subscribe((response) => {
        this.isLoading = false;
        this.MessageService.add({
          severity: 'success',
          summary: 'نجاح',
          detail: 'تم حفظ التغييرات بنجاح',
        });
      });
  }

  // Convert links array back to request body format
  convertLinksToRequestBody(links: any[]): IUpdateSocialLinks {
    const requestBody: IUpdateSocialLinks = {
      tweet_url: null,
      snapchat_url: null,
      instgram_url: null,
      watus_number: null,
      face_url: null,
      youtube_url: null,
      youtube_embedded: null,
      tiktok_url: null,
      phone_number: null,
      location: null,
      main_email: null,
      telegram_url: null,
    };

    links.forEach((link) => {
      if (link.key in requestBody) {
        requestBody[link.key as keyof IUpdateSocialLinks] =
          link.url?.trim() || 'null';
      }
    });

    return requestBody;
  }
}
