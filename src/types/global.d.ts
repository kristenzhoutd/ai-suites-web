import type { AISuitesAPI } from '../../electron/preload';

declare global {
  interface Window {
    aiSuites: AISuitesAPI;
  }
}
