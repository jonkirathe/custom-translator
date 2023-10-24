import {
  Component,
  DestroyRef,
  ElementRef,
  inject,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {NgxMultilingualService} from "ngx-multilingual";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {Languages} from "./languages";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'custom-translator';
  languages: Languages[] = [];
  translatedText: string = '';
  translatedTextList: string[] = [];
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly translationService = inject(NgxMultilingualService);

  @ViewChildren('paragraph,paragraph2,paragraph3', {read: ElementRef}) paragraphs: any;
  @ViewChild('paragraph', {read: ElementRef}) paragraph: any;

  constructor() {
  }

  ngOnInit(): void {
    this.getLanguages();
  }

  ngAfterViewInit() {
    this.translate(this.paragraph.nativeElement.innerHTML, 'ar');
    for (let paragraph of this.paragraphs._results) {
      this.translate(paragraph.nativeElement.innerHTML, 'ar')
    }
  }

  getLanguages(): void {
    this.translationService.languages()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((languages) => {
        this.languages = languages;
      });
  }

  translate(text: string, targetLanguage: string): void {
    this.translationService.translateText(text, targetLanguage)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((translation) => {
        this.translatedText = translation;
        this.translatedTextList.unshift(translation)
      }, error => {
        console.log('error: ', error)
      });
  }
}
