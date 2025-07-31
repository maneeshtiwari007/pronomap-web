// Environment variables configuration
export const ENV = {
  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: 'AIzaSyBD3jlRyXvilfXTs0572Z7rYmCAZIbzvb0'//'AIzaSyAezq4Oknv0Z84SyC1l8CJN5QtNfr6KetQ',
};
 
// Make ENV available on window for client-side access
if (typeof window !== 'undefined') {
  (window as any).ENV = ENV;
} 