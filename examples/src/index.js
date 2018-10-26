/***  examples/src/index.js ***/
import React from 'react';
import { render } from 'react-dom';
import BasicCarousel from '../BasicCarousel';
import CustomButtons from '../CustomButtons';
import InfiniteCarousel from '../InfiniteCarousel';
import AutoplayCarousel from '../AutoplayCarousel';
import ResponsiveCarousel from '../ResponsiveCarousel';
import SetSlideCarousel from '../SetSlideCarousel';
import './styles.css';

const App = (props) => {
  return (
    <div className="main-container">
      <h1>Light Carousel Examples</h1>
      <BasicCarousel />
      <CustomButtons />
      <InfiniteCarousel />
      <AutoplayCarousel />
      <ResponsiveCarousel />
      <SetSlideCarousel />
    </div>);
}

render(<App />, document.getElementById("root"));