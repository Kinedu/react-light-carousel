
import React, { Component, Fragment } from 'react';
import LightCarousel from '../src/index';

const Back = () => (<div>{'◀'}</div>);
const Next = () => (<div>{'▶'}</div>);

const ResponsiveCarousel = () => {
  return (
    <Fragment>
      <h2>Responsive carousel</h2>
      <LightCarousel
        slidesToShow={5}
        gap={20}
        infinite
        showControls
        prevBtn={<Back />}
        nextBtn={<Next />}
        responsive={{
          0: 1,
          400: 2,
          900: 4,
        }}
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

export default ResponsiveCarousel;