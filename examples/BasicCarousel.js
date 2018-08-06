import React, { Component, Fragment } from 'react';
import LightCarousel from '../src/index';

const BasicCarousel = () => {
  return (
    <Fragment>
      <h2>Basic carousel</h2>
      <LightCarousel gap={20} showControls>
        <span className="basic-slide">slide 1</span>
        <span className="basic-slide">slide 2</span>
        <span className="basic-slide">slide 3</span>
      </LightCarousel>
    </Fragment>
  );
}

export default BasicCarousel;