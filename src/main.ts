import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

//import { DOCUMENT } from  '@angular/platform-browser'

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
/*
export class myModalComponent implements OnDestroy {

  constructor(private renderer: Renderer) {
    this.renderer.setElementClass(document.body, 'tres_petite', true);
   }

  OnDestroy() {
    this.renderer.setElementClass(document.body, 'tres_petite', false);
  }
}
*/