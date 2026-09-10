import { offlineSyncService } from './services/offlineSyncService';

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    try {
      window.addEventListener('load', () => {
        try {
          navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
              console.log('[SW Registration] ServiceWorker registered with scope:', registration.scope);

              // Check for periodic updates
              registration.onupdatefound = () => {
                const installingWorker = registration.installing;
                if (installingWorker) {
                  installingWorker.onstatechange = () => {
                    if (installingWorker.state === 'installed') {
                      if (navigator.serviceWorker.controller) {
                        console.log('[SW Registration] New content available.');
                      } else {
                        console.log('[SW Registration] Content is cached for offline rural use.');
                      }
                    }
                  };
                }
              };

              // Register Background Sync if supported
              if ('sync' in registration) {
                // @ts-ignore
                registration.sync.register('sync-field-tasks').catch(() => {});
              }
            })
            .catch((error) => {
              console.info('[SW Registration] ServiceWorker note (normal in some sandboxes):', error?.message || error);
            });

          // Listen for messages from Service Worker (e.g. background sync events)
          navigator.serviceWorker.addEventListener('message', (event) => {
            if (!event.data) return;
            if (
              event.data.type === 'GRAMAPALA_BACKGROUND_SYNC' || 
              event.data.type === 'GRAMAPALA_FORCE_SYNC'
            ) {
              console.log('[SW Registration] Triggering offline sync queue flush...');
              offlineSyncService.syncPendingQueue();
            }
          });
        } catch (e) {
          console.info('[SW Registration] SW registration skipped in sandbox:', e);
        }
      });
    } catch (err) {
      console.info('[SW Registration] ServiceWorker listener setup skipped:', err);
    }
  }
}

