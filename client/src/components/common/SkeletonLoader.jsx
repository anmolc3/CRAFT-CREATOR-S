import React from 'react';

export const FrameSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden shadow-card animate-pulse border border-[#eaeaea]">
    <div className="aspect-[4/3] bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/3" />
      <div className="h-6 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="pt-4 flex justify-between items-center">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="h-10 bg-gray-200 rounded-full w-1/3" />
      </div>
    </div>
  </div>
);

export const ServiceSkeleton = () => (
  <div className="bg-white rounded-2xl p-6 shadow-card animate-pulse border border-[#eaeaea] space-y-4">
    <div className="h-12 w-12 bg-gray-200 rounded-xl" />
    <div className="h-6 bg-gray-200 rounded w-3/4" />
    <div className="h-4 bg-gray-200 rounded w-full" />
    <div className="h-4 bg-gray-200 rounded w-5/6" />
    <div className="pt-4 h-4 bg-gray-200 rounded w-1/4" />
  </div>
);

export const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto px-6 py-12 animate-pulse grid grid-cols-1 lg:grid-cols-2 gap-12">
    <div className="aspect-[4/3] bg-gray-200 rounded-2xl" />
    <div className="space-y-6">
      <div className="h-4 bg-gray-200 rounded w-1/4" />
      <div className="h-10 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-20 bg-gray-200 rounded w-full" />
      <div className="space-y-3 pt-6">
        <div className="h-6 bg-gray-200 rounded w-1/3" />
        <div className="h-12 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  </div>
);
