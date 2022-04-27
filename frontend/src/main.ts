import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
  console.log = () => { }; //send all logs to null at production
  //errors/warn will persist
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
