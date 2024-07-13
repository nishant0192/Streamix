import React from "react";

interface SkeletonLoaderProps {
  height: string;
  width: string;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ height, width }) => {
  return (
    <div className="animate-pulse">
      <div className={`bg-gray-200 h-${height} w-${width} rounded-md mb-4`} />
      <div
        className={`bg-gray-200 h-${height} w-${width} rounded-md mb-4 mt-4`}
      />
      <div className={`bg-gray-200 h-${height} w-${width} rounded-md mb-6`} />
      <div className={`bg-gray-200 h-${height} w-${width} rounded-md mb-4`} />
      <div className={`bg-gray-200 h-${height} w-${width} rounded-md mb-4`} />
      <div className={`bg-gray-200 h-${height} w-${width} rounded-md`} />
    </div>
  );
};

export default SkeletonLoader;
