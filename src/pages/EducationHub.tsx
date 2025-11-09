import React, { useState } from 'react';
import {
  Search,
  Play,
  Clock,
  Eye,
  Droplet,
  Bug,
  Leaf,
  Droplets,
  Sprout,
} from 'lucide-react';
import { useVideos, useVideoCategories } from '../hooks/useVideos';
import { Navbar } from '../components/layout';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Input,
  Badge,
  LoadingState,
} from '../components/common';
import { format } from 'date-fns';

const categoryIcons: Record<string, React.ReactNode> = {
  'Drought Management': <Droplet className="w-5 h-5" />,
  'Pest Control': <Bug className="w-5 h-5" />,
  'Soil Health': <Leaf className="w-5 h-5" />,
  'Irrigation Techniques': <Droplets className="w-5 h-5" />,
  'Crop Management': <Sprout className="w-5 h-5" />,
};

export const EducationHub: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const { videos, isLoading } = useVideos(searchQuery, categoryFilter);
  const { categories } = useVideoCategories();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <LoadingState message="Loading videos..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Education Hub</h1>
          <p className="text-gray-600">
            Learn best practices and get expert advice for your farm
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  icon={<Search className="w-5 h-5" />}
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                <button
                  onClick={() => setCategoryFilter('all')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                    categoryFilter === 'all'
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All Videos
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={`px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                      categoryFilter === category
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        {categoryFilter === 'all' && !searchQuery && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => {
                const videoCount = videos.filter(v => v.category === category).length;
                return (
                  <Card
                    key={category}
                    hover
                    className="cursor-pointer"
                    onClick={() => setCategoryFilter(category)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                          {categoryIcons[category] || <Sprout className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {category}
                          </h3>
                          <p className="text-xs text-gray-500">
                            {videoCount} videos
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Videos Grid */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {categoryFilter === 'all' ? 'All Videos' : categoryFilter}
            </h2>
            <p className="text-sm text-gray-600">
              {videos.length} video{videos.length !== 1 ? 's' : ''}
            </p>
          </div>

          {videos.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-gray-500">
                  No videos found. Try adjusting your search or filters.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.id} hover className="overflow-hidden">
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                        <Play className="w-6 h-6 text-primary-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="info" size="sm">
                        {video.category}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {video.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {video.views.toLocaleString()} views
                      </div>
                      <span>{format(video.uploadDate, 'MMM dd, yyyy')}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Popular Topics */}
        {categoryFilter === 'all' && !searchQuery && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <CardTitle>Popular Topics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Drought Management',
                    'Pest Control',
                    'Soil Health',
                    'Irrigation',
                    'Crop Rotation',
                    'Fertilization',
                    'Weather Adaptation',
                    'Organic Farming',
                  ].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => setSearchQuery(topic)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full text-sm transition-colors"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
