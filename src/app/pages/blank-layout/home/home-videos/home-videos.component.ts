import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, signal } from '@angular/core';
import { IYoutube } from '../../../../core/interfaces/IYoutube';
import { SafeHtmlPipe } from '../../../../core/pipes/safe-html.pipe';
import { HomeContentService } from '../../../../core/services/content/home/home-content.service';
import { SocialMediaLinksService } from '../../../../core/services/shared/social-media-links.service';
import { SlicePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-videos',
  imports: [SafeHtmlPipe, SlicePipe],
  templateUrl: './home-videos.component.html',
  styleUrl: './home-videos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeVideosComponent {
  destroyRef = inject(DestroyRef);
  SocialMediaLinksService = inject(SocialMediaLinksService);
  _HomeContentService = inject(HomeContentService);
  currentYoutubeVideos = signal<IYoutube | null>(null);
  videoIframe = signal<string>('');
  isDesktop = input();

  ngOnInit(): void {
    this.getHomeVideo();
    this.getLocalNews();
  }

  getLocalNews() {
    this._HomeContentService.getHomeYouTube().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.currentYoutubeVideos.set(response);
      },
    });
  }

  getHomeVideo() {
    this.SocialMediaLinksService.getSocialMediaLinks().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (response) => {
        this.videoIframe.set(response?.contact.youtube_embedded);
      },
    });
  }

  onClickOpenYouTubeVideo(targetVideoUrl: string | undefined): void {
    if (!targetVideoUrl) {
      return;
    }
    window.open(`https://www.youtube.com/watch?v=${targetVideoUrl}`, '_blank');
  }

  onClickOpenYouTube(): void {
    window.open('https://www.youtube.com/@asda-alkhaleej', '_blank');
  }
}
