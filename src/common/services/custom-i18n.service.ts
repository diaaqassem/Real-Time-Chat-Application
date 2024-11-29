import { Injectable } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Injectable()
export class CustomI18nService {
  constructor(private readonly i18n: I18nService) {}
  translate(key: string, options?: any) {
    const currentLang = I18nContext.current()?.lang || 'ar';
    return this.i18n.t(key, { currentLang, ...options });
  }
}
