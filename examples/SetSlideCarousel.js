
import React, { Component, Fragment } from 'react';
import LightCarousel from '../src/index';

const Back = () => (<div>{'◀'}</div>);
const Next = () => (<div>{'▶'}</div>);

class SetSlideCarousel extends Component {
  state = { selectedSlide: 6, inputValue: 6 };

  setSlide = (selectedSlide) => this.setState({ selectedSlide: Number(this.state.inputValue) });

  setValue = (event) => this.setState({ inputValue: event.target.value });

  render() {
    return (
      <Fragment>
        <h2>SetSlide carousel</h2>
        <LightCarousel
          slidesToShow={5}
          gap={20}
          showControls
          prevBtn={<Back />}
          nextBtn={<Next />}
          responsive={{
            0: 1,
            400: 2,
            900: 5,
          }}
          setSlide={this.state.selectedSlide}
        >
          <span className="basic-slide" onClick={() => this.setSlide(0)}>slide 1</span>
          <span className="basic-slide" onClick={() => this.setSlide(1)}>slide 2</span>
          <span className="basic-slide" onClick={() => this.setSlide(2)}>slide 3</span>
          <span className="basic-slide" onClick={() => this.setSlide(3)}>slide 4</span>
          <span className="basic-slide" onClick={() => this.setSlide(4)}>slide 5</span>
          <span className="basic-slide" onClick={() => this.setSlide(5)}>slide 6</span>
          <span className="basic-slide" onClick={() => this.setSlide(7)}>slide 7</span>
          <span className="basic-slide" onClick={() => this.setSlide(8)}>slide 8</span>
        </LightCarousel>
        <button onClick={this.setSlide}>set slide</button>
        <input type="number" value={this.state.inputValue} onChange={this.setValue} />
      </Fragment>
    );
  }
}

export default SetSlideCarousel;