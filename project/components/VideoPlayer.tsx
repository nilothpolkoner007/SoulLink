// components/VideoPlayer.tsx
import React from 'react';
import { Platform } from 'react-native';

// Important: We use these names specifically
import VideoPlayerNative from './VideoPlayer.native';
import VideoPlayerWeb from './VideoPlayer.web';

const VideoPlayer = (props: any) => {
  // If the OS is web, render the Web component.
  // Metro will completely ignore the .native file for web builds.
  return Platform.OS === 'web' ? <VideoPlayerWeb {...props} /> : <VideoPlayerNative {...props} />;
};

export default VideoPlayer;
