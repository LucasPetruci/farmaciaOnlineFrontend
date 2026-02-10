import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { pt_BR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { NzMessageService } from 'ng-zorro-antd/message';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { EyeOutline, EyeInvisibleOutline, PlusOutline, SearchOutline, FilterOutline, EllipsisOutline, LogoutOutline, DownOutline, EditOutline } from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { registerLocaleData } from '@angular/common';
import pt from '@angular/common/locales/pt';
import { FormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from './http/api.interceptor';

registerLocaleData(pt);

const icons: IconDefinition[] = [
  EyeOutline, 
  EyeInvisibleOutline, 
  PlusOutline, 
  SearchOutline, 
  FilterOutline, 
  EllipsisOutline,
  LogoutOutline,
  DownOutline,
  EditOutline
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    provideNzI18n(pt_BR),
    provideNzIcons(icons),
    importProvidersFrom(FormsModule), 
    provideAnimationsAsync(), 
    provideHttpClient(withInterceptors([apiInterceptor])),
    NzMessageService
  ]
};
