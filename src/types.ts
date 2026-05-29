/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  condition: "New" | "Refurbished" | "Like New" | "Good" | "Fair";
  tags: string[];
  image: string;
  sellerId: string;
  sellerName: string;
  sellerRating: number;
  sellerTrustScore: number;
  buyerMinOffer?: number;
  trustRiskRating: "Low" | "Medium" | "High";
  status: "active" | "sold" | "moderation_review" | "flagged";
  views: number;
  offersCount: number;
  likesCount: number;
  createdAt: string;
  moderationReason?: string;
  trustAnalytics?: string;
}

export interface ChatMessage {
  id: string;
  sender: "buyer" | "seller" | "system" | "advisor";
  text: string;
  timestamp: string;
  offerValue?: number;
}

export interface ChatSession {
  chatId: string;
  productId: string;
  buyerId: string;
  buyerName: string;
  currentOffer?: number;
  lastOfferSender?: "buyer" | "seller";
  sellerMinPrice: number;
  status: "bargaining" | "accepted" | "declined" | "completed";
  messages: ChatMessage[];
  lastUpdated: string;
}

export interface UserProfile {
  userId: string;
  username: string;
  email: string;
  role: "buyer" | "seller" | "moderator" | "admin";
  trustScore: number; // 0 to 100
  walletBalance: number;
  avatar: string;
  listingsCreated: number;
  purchasedCount: number;
  salesCount: number;
  onboardingStep: number; // 0 for completed, 1, 2, 3, 4 for stages
}

export interface Order {
  orderId: string;
  productId: string;
  productTitle: string;
  productImage: string;
  price: number;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  status: "processing" | "shipped" | "delivered" | "flagged";
  createdAt: string;
  trackingNumber?: string;
}

export interface AppState {
  products: Product[];
  chats: ChatSession[];
  currentUser: UserProfile;
  orders: Order[];
  notifications: AppNotification[];
  selectedRoute: string; // '/' | '/login' | '/register' | '/dashboard' | '/products' | '/shop/[id]' | '/messages' | '/orders' | '/ai/list' | '/ai/history' | '/analytics' | '/settings' | '/admin' | '/design-system'
  selectedProductId?: string; // For detail view or storefront
  selectedChatId?: string; // For chat window
  selectedSellerId?: string; // For shop storefront S19/S20
}

export interface AppNotification {
  id: string;
  title: string;
  description: string;
  type: "info" | "offer" | "order" | "alert" | "moderation";
  read: boolean;
  timestamp: string;
}
