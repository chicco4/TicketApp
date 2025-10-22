import { Pipe, PipeTransform } from '@angular/core';

export interface MoneyPipeOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  currencyDisplay?: Intl.NumberFormatOptions['currencyDisplay'];
}

@Pipe({
  name: 'money',
  standalone: true,
})
export class MoneyPipe implements PipeTransform {
  transform(value: number | string | null | undefined, options: MoneyPipeOptions = {}): string {
    if (value === null || value === undefined || value === '') {
      return '';
    }

    const numericValue =
      typeof value === 'number'
        ? value
        : Number((value as string).trim().replace(/[,\s]+/g, ''));

    if (!Number.isFinite(numericValue)) {
      return '';
    }

    const {
      currency = 'USD',
      locale,
      minimumFractionDigits = 2,
      maximumFractionDigits = 2,
      useGrouping = true,
      currencyDisplay = 'symbol',
    } = options;

    const minFraction = Math.max(0, Math.min(20, Math.floor(minimumFractionDigits)));
    const maxFraction = Math.max(minFraction, Math.min(20, Math.floor(maximumFractionDigits)));

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      useGrouping,
      currencyDisplay,
      minimumFractionDigits: minFraction,
      maximumFractionDigits: maxFraction,
    }).format(numericValue);
  }
}
