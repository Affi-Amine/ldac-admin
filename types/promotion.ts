export interface Promotion {
    promotion_id: number;
    name: string;
    description: string;
    pack_type: string;
    valid_from: string;
    valid_until: string;
    usage_limit: number;
    image?: string;
    partner_name: string | null;
  }
  
  export interface NewPromotion {
    name: string;
    description: string;
    pack_type: string;
    valid_from: string;
    valid_until: string;
    usage_limit: number;
    image?: File;
    partner_id: number;
  }
  
  export interface PromotionsResponse {
    success: boolean;
    data: Promotion[];
  }
  
  