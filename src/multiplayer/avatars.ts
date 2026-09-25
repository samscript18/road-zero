import { DEFAULT_AVATARS } from '../../shared/multiplayer-protocol.js';

const styles: Record<string, { paint: string; trim: string; kind: 'helmet' | 'cap' | 'goggles' }> = {
  'red-helmet': { paint: '#D74B3F', trim: '#EFE1C6', kind: 'helmet' },
  'ochre-helmet': { paint: '#D5A23B', trim: '#353A3B', kind: 'helmet' },
  'blue-helmet': { paint: '#507D92', trim: '#EFE1C6', kind: 'helmet' },
  'green-helmet': { paint: '#53694C', trim: '#EFE1C6', kind: 'helmet' },
  'cream-cap': { paint: '#EFE1C6', trim: '#C86845', kind: 'cap' },
  'orange-cap': { paint: '#C86845', trim: '#353A3B', kind: 'cap' },
  'sage-goggles': { paint: '#849077', trim: '#EFE1C6', kind: 'goggles' },
  'stone-goggles': { paint: '#A88869', trim: '#353A3B', kind: 'goggles' },
};

export const avatarIds = [...DEFAULT_AVATARS];

export function avatarDataUrl(id: string | null | undefined): string {
  const style = styles[id || ''] || styles['red-helmet'];
  const headwear = style.kind === 'helmet'
    ? `<path d="M42 115C42 57 73 28 128 28s86 29 86 87v25H42z" fill="${style.paint}" stroke="#353A3B" stroke-width="8"/><path d="M128 31v104" stroke="${style.trim}" stroke-width="15"/><path d="M48 120h160v34H48z" fill="#353A3B"/><path d="M59 128h138v13H59z" fill="#6E8791"/>`
    : style.kind === 'cap'
      ? `<path d="M46 106c8-50 35-70 82-70s74 20 82 70z" fill="${style.paint}" stroke="#353A3B" stroke-width="8"/><path d="M49 105h158l25 20H32z" fill="${style.trim}" stroke="#353A3B" stroke-width="7"/>`
      : `<path d="M48 99c10-43 36-64 80-64s70 21 80 64z" fill="${style.paint}" stroke="#353A3B" stroke-width="8"/><path d="M31 106h194v26H31z" fill="#79533F"/><rect x="50" y="105" width="68" height="42" rx="16" fill="${style.trim}" stroke="#353A3B" stroke-width="8"/><rect x="138" y="105" width="68" height="42" rx="16" fill="${style.trim}" stroke="#353A3B" stroke-width="8"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><rect width="256" height="256" fill="#D8C49E"/><circle cx="128" cy="128" r="116" fill="#EFE1C6"/><path d="M24 256c15-64 47-86 104-86s89 22 104 86" fill="${style.paint}" stroke="#353A3B" stroke-width="8"/><ellipse cx="128" cy="137" rx="60" ry="72" fill="#B98262" stroke="#353A3B" stroke-width="6"/>${headwear}<path d="M101 163q27 18 54 0" fill="none" stroke="#79533F" stroke-width="5" stroke-linecap="round"/><path d="M32 222h192" stroke="#353A3B" stroke-width="7"/></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
