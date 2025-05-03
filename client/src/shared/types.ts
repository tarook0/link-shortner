export interface UrlItem {
    id: string;
    originalUrl: string;
    shortCode: string;
    clicks: number;
    createdAt: string;
  }
  
  export interface CreateUrlRequest {
    url: string;
    customCode?: string;
  }
  
  export interface CreateUrlResponse {
    url: UrlItem;
  }
  
  export interface UrlListResponse {
    urls: UrlItem[];
  }
  import 'react'

declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    className?: string
  }
}