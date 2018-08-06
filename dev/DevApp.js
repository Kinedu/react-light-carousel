import React from 'react';
import BasicCarousel from '../examples/BasicCarousel';
import CustomButtons from '../examples/CustomButtons';
import InfiniteCarousel from '../examples/InfiniteCarousel';
import AutoplayCarousel from '../examples/AutoplayCarousel';
import ResponsiveCarousel from '../examples/ResponsiveCarousel';

const DevApp = (props) => {
  return (
    <div className="main-container">
      <h1>Light Carousel Examples</h1>
      <BasicCarousel />
      <CustomButtons />
      <InfiniteCarousel />
      <AutoplayCarousel />
      <ResponsiveCarousel />
    </div>);
}

export default DevApp;