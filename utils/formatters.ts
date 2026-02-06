import { I18nManager } from "react-native";

export const toPersianNumbers = (str: string | number, language: string): string => {
  if (language !== 'fa') return str.toString();
  
  const id = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.toString().replace(/[0-9]/g, function(w){
      return id[+w]
  });
}

export const toEnglishDigits = (str: string): string => {
    const persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
    let res = str;
    for (let i = 0; i < 10; i++) {
        res = res.replace(persianNumbers[i], i.toString());
    }
    // Remove commas
    return res.replace(/,/g, '');
}

const addCommas = (num: string | number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export const getTodayDate = (language: string): string => {
    if (language === 'fa') {
        try {
            // Use Intl to get Shamsi date
            // Note: In React Native (Hermes), Intl support for 'persian' calendar might depend on the engine version.
            // If this fails or returns Gregorian, we might need a fallback, but let's try standard API first.
            const formatter = new Intl.DateTimeFormat('fa-IR', {
                calendar: 'persian',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                numberingSystem: 'latn' // Keep digits latin for the value potentially, or persian? 
                                        // User wants Persian numbers. But mixing Persian digits in Date Strings might call for trouble if parsing?
                                        // Let's stick to Persian visual digits if requested, but for "value" let's use what the user expects.
                                        // If the user inputs "1402/01/01", they usually use latin digits on keyboard or persian digits?
                                        // Let's use standard digits for the "default value" string so it's editable, 
                                        // but if the user wants "numbers to be persian", they probably mean visual numbers.
            });
            const parts = formatter.formatToParts(new Date());
            // parts usually come as year, literal, month, literal, day... 
            // format: 1402/11/17
            // We want YYYY/MM/DD format roughly.
            return formatter.format(new Date());
        } catch (e) {
            return new Date().toISOString().split('T')[0];
        }
    }
    return new Date().toISOString().split('T')[0];
}

export const formatCurrency = (amount: number, language: string): string => {
    const withCommas = addCommas(amount);
    const formattedNum = toPersianNumbers(withCommas, language);
    if (language === 'fa') {
        return `${formattedNum} تومان`;
    }
    return `$${withCommas}`;
}

export const formatNumber = (value: number | string, language: string): string => {
    // Strip existing formatting first to be safe if string passed
    const clean = typeof value === 'string' ? toEnglishDigits(value) : value;
    if (clean === '') return '';
    const withCommas = addCommas(clean);
    return toPersianNumbers(withCommas, language);
}

export const formatDistance = (value: number, language: string): string => {
    const withCommas = addCommas(value);
    const formattedNum = toPersianNumbers(withCommas, language);
    if (language === 'fa') {
        return `${formattedNum} کیلومتر`;
    }
    return `${withCommas} km`;
}

export const formatDate = (dateStr: string, language: string): string => {
    // If we're in Persian mode and date looks like ISO Gregorian, try to show Shamsi
    if (language === 'fa' && dateStr && dateStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
        try {
             const d = new Date(dateStr);
             if (!isNaN(d.getTime())) {
                const shamsi = new Intl.DateTimeFormat('fa-IR', {
                    calendar: 'persian',
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                }).format(d);
                return shamsi; // This will likely have format 1402/11/17 (with persian digits or latin depending on locale impl)
             }
        } catch(e) {}
    }
    return toPersianNumbers(dateStr, language);
}
