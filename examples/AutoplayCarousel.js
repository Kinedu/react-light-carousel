import React, { Component, Fragment } from 'react';
import LightCarousel from '../src/index';

const Back = () => (<div>{'◀'}</div>);
const Next = () => (<div>{'▶'}</div>);

const AutoplayCarousel = () => {
  return (
    <Fragment>
      <h2>Autoplay carousel</h2>
      <LightCarousel
        slidesToShow={5}
        gap={20}
        autoplay
        infinite
        showControls
        prevBtn={<Back />}
        nextBtn={<Next />}
      >
        <span className="basic-slide">slide 1</span>
        <span className="basic-slide">slide 2</span>
        <span className="basic-slide">slide 3</span>
        <span className="basic-slide">slide 4</span>
        <span className="basic-slide">slide 5</span>
        <span className="basic-slide">slide 6</span>
      </LightCarousel>
    </Fragment>
  );
}

export default AutoplayCarousel;