import { useState, useEffect, useMemo } from 'react';
import { getVideos, searchVideos, getVideosByCategory, getVideoCategories, incrementVideoViews } from '../services/videos';
import type { Video } from '../types';

export function useVideos(searchQuery?: string, categoryFilter?: string) {
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadVideos();
  }, []);

  const loadVideos = () => {
    const videos = getVideos();
    setAllVideos(videos);
    setIsLoading(false);
  };

  // Filter videos based on search query and category
  const videos = useMemo(() => {
    let filtered = allVideos;

    // Apply category filter
    if (categoryFilter && categoryFilter !== 'all') {
      filtered = filtered.filter((video) => video.category === categoryFilter);
    }

    // Apply search query
    if (searchQuery && searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (video) =>
          video.title.toLowerCase().includes(query) ||
          video.description.toLowerCase().includes(query) ||
          video.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allVideos, searchQuery, categoryFilter]);

  const playVideo = (videoId: string) => {
    incrementVideoViews(videoId);
    loadVideos(); // Reload to update view count
  };

  return {
    videos,
    allVideos,
    isLoading,
    playVideo,
    refresh: loadVideos,
  };
}

export function useVideoCategories() {
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const cats = getVideoCategories();
    setCategories(cats);
    setIsLoading(false);
  }, []);

  return { categories, isLoading };
}
