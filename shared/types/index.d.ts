export {};

declare global {
  interface GetClipResponse {
    clip: {
      id: string;
      livestream_id: string;
      category_id: string;
      channel_id: number;
      user_id: number;
      title: string;
      clip_url: string;
      thumbnail_url: string;
      privacy: string;
      likes: number;
      liked: boolean;
      views: number;
      duration: number;
      started_at: string;
      created_at: string;
      is_mature: boolean;
      video_url: string;
      view_count: number;
      likes_count: number;
      category: {
        id: number;
        name: string;
        slug: string;
        responsive: boolean;
        banner: string;
        parent_category: string;
      };
      creator: {
        id: number;
        username: string;
        slug: string;
        profile_picture?: string;
      };
      channel: {
        id: number;
        username: string;
        slug: string;
        profile_picture?: string;
      };
    };
  }

  interface KickClipTypes {
    filename: string;
    channel: string;
    slug: string;
    channelPicture: string;
    title: string;
    views: number;
    likes: number;
    blob: string;
    creator: string;
    creatorSlug: string;
    date: string;
    duration: number;
  }

  interface KickChannelSearchResult {
    hits: {
      document: {
        follower_count: number;
        id: number;
        is_banned: boolean;
        is_live: boolean;
        slug: string;
        username: string;
        verified: boolean;
      };
    }[];
  }
}
