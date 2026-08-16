export function formatNiceDate(dateStr) {
            if (!dateStr) return '';
            const parsed = parseSheetDate(dateStr);
            const d = new Date(parsed);
            if (isNaN(d)) return dateStr;
            return d.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace(',', '');
        }