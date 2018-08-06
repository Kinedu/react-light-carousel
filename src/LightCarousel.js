import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as R from 'ramda';

const equalAt = (a, b, path) => R.eqBy(R.view(R.lensPath(path)), a, b);

export const LightCarouselContainer = ({ children, containerStyle, ...props }) => (
  <div style={{
    position: 'relative',
    display: 'block',
    width: '100%',
    ...containerStyle,
  }}>{children}</div>
);

export const Slideshow = ({ children, className, slideshowStyle, slideshowRef, ...props }) => (
  <div
    {...props}
    ref={slideshowRef}
    style={{
      position: 'relative',
      display: 'block',
      width: '100%',
      overflowX: 'hidden',
      ...slideshowStyle,
  }}>{children}</div>
);

export const SlidesContainer = ({ children, slideshowWidth, slideContainerRef, ...props }) => (
  <div
    {...props}
    ref={slideContainerRef}
    style={{
      position: 'relative',
      transform: 'translate3d(0, 0, 0)',
      width: slideshowWidth,
  }}>{children}</div>
);

export const Slide = ({ children, autoWidth, slideWidth, gap, ...props }) => (
  <div {...props} style={{
    position: 'relative',
    display: 'block',
    float: 'left',
    width: autoWidth,
    marginRight: gap,
  }}>{children}</div>
);

export const ButtonsContainer = ({ children, buttonsContainerStyle, ...props }) =>
  (<div {...props} style={{ position: 'relative', ...buttonsContainerStyle }}>{children}</div>);

export const Button = ({ children, ...props }) =>
  (<span {...props} style={{ cursor: 'pointer' }}>{children}</span>);

class LightCarousel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
      enableClick: true,
    };
  }

  componentDidMount() {
    this.initCarousel();
    this.setEndTransition(this.onSlide);
  }

  componentWillReceiveProps(newProps) {
    /* Updates the current slide when the setSlide changes */
    if (!equalAt(this.props, newProps, ['setSlide'])) {
      this.slideTo(newProps.setSlide);
      this.move(newProps.setSlide);
    }
  }

  componentWillUnmount() {
    /* Remove listeners */
    this.slidesContainer.removeEventListener(this.state.endTransition, this.onSlide, false);
    this.slidesContainer.removeEventListener('mouseover', this.clearAutoplay, false);
    this.slidesContainer.removeEventListener('mouseout', this.setAutoplay, false);
    window.removeEventListener('resize', this.handleResize, false);
    /* Clear intervals */
    this.clearAutoplay();
  }

  /**
    * Initialization of all the settings of the carousel.
  */
  initCarousel = () => {
    const {
      autoplay,
      gap,
      infinite,
      slideWidth,
      slidesToShow,
      setSlide,
      stopOnHover,
      speed,
      responsive,
      children,
    } = this.props;

    this.breakpoints = Object.keys(responsive);
    this.slidesToShow = slidesToShow;
    this.setResizeBreakpoint();

    if (responsive && this.currentBreakpoint) {
      this.slidesToShow = responsive[this.currentBreakpoint];
    }

    this.slideshowClientWidth = R.path(['clientWidth'], this.slideshow);
    this.autoWidth = ((this.slideshowClientWidth + gap) / this.slidesToShow) - gap;
    this.displacement = (slideWidth || this.autoWidth) + gap;
    this.currentPosition = infinite ? -(this.displacement * (this.slidesToShow)) : 0;
    /* It needs to pass the children to the "toArray" react function, because
     * if there is only one child, it won't be an array of one.
     */
    this.totalUniqueElements = React.Children.toArray(children).length;
    this.totalSlides = infinite ?
      this.calculateTotalSlides(this.slidesToShow, this.totalUniqueElements) :
      this.totalUniqueElements;
    this.slideshowWidth = this.totalSlides * (this.displacement + gap);
    this.autoplayFunc = autoplay && setInterval(this.moveForward, speed);

    if (infinite && stopOnHover && autoplay) this.setMouseEvents(this.clearAutoplay, this.setAutoplay);

    /*  Set the right amount of sliders to shown, given the current device width */
    this.setResizeEvent();
    /* Move the position to the first original slide */
    this.slidesContainer.style.transform = `translateX(${this.currentPosition}px)`;
    if (setSlide > 0) {
      this.slideTo(setSlide);
    }
  }

  /**
    * Reset the position of the slideshow
    * when reachs the seamless cut.
  */
  onSlide = () => {
    if (this.props.infinite) {
      /* When the current slide index is equal to the index of the last
      of the original elements, reset the position to the beginning. */
      if (this.state.currentSlide === this.totalUniqueElements) {
        console.log('start');
        this.resetPositionTo('start');
      } else if (this.state.currentSlide === -1) {
        console.log('end');
        this.resetPositionTo('end');
      }

      this.resetCurrentSlide();
    }
    /* Enable click again, so the user can click safetly */
    this.setState({ enableClick: true });
  }

  /**
    * Set the event listener, of a specific browser, of the moment when a
    * transition ends.
    *
    * @param {function} eventFunction The event handler
  */
  setEndTransition = (eventFunction) => {
    const el = document.createElement('element');
    const endTransitions = {
      transition: 'transitionend',
      OTransition: 'oTransitionEnd',
      MozTransition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
    };
    /** Check if the transiton name exists on current browser */
    const endTransition = Object.entries(endTransitions)
      .find(([key]) => el.style[key] !== undefined)[1];

    /**  Set the event listener to state so it can be removed later */
    this.setState({ endTransition },
      () => this.slidesContainer.addEventListener(this.state.endTransition, eventFunction, false));
  }

  /**
    * Set the mouse events
    *
    * @param {function} overFunction The function to execute when the mouse is over the element.
    * @param {function} outFunction The function to execute when the mouse is out the element.
  */
  setMouseEvents = (overFunction, outFunction) => {
    this.slidesContainer.addEventListener('mouseover', overFunction, false);
    this.slidesContainer.addEventListener('mouseout', outFunction, false);
  }

  /**
    * Set the window resize event
    *
  */
  setResizeEvent = () => {
    window.addEventListener('resize', this.handleResize);
  }

  /**
    * Set the autoplay interval function.
  */
  setAutoplay = () => {
    this.autoplayFunc = setInterval(this.moveForward, this.props.speed);
  }

  /**
    * Set the right breakpoint given the current window size
  */
  setResizeBreakpoint = () => {
    if (this.breakpoints) {
      const windowSize = window.innerWidth;
      /* Reset the currentBreakpoint to 0.
       * This will be the fallback when no breakpoint is found
       */
      this.currentBreakpoint = 0;
      this.breakpoints.forEach((breakpoint) => {
        if (windowSize >= breakpoint) {
          this.currentBreakpoint = breakpoint;
        }
      });
    }
  }

  /**
    * Handle the logic when window resizes
    * TODO: Add a debounce prop to prevent doing lots of calculations
  */
  handleResize = () => {
    this.setResizeBreakpoint();
    this.resetSliderPosition();
  }

  /* When a resize occurs the slides will be reset
    * to their initial position. This will prevent the slider
    * to offset when another breakpoint it's reached.
  */
  resetSliderPosition = () => {
    this.slideTo(0);
    this.currentPosition = 0;
    this.slidesContainer.style.transform = `translateX(${this.currentPosition}px)`;
  }

  /**
    * Clear the autoplay interval function.
  */
  clearAutoplay = () => {
    clearInterval(this.autoplayFunc);
  }

  /**
   * Calculate the total number of slides including the clones.
   */
  calculateTotalSlides = (slidesToShow, elements) => ((slidesToShow) * 2) + elements;

  /**
    * Add the necesary clones to create the illution
    * of the infinite loop.
    *
    * @param {array} array The array with the original slides.
    * @param {number} items The number of items to display.
  */
  addClones = (array, items) => {
    for (let i = 0; i < (items); i += 1) { array.push(array[i]); }
    for (let i = 0; i < (items); i += 1) { array.unshift(array[(array.length - i) - (items + 1)]); }
    return array;
  }

  /**
    * Move slide backward.
    * Update the current position and
    * disable click to prevent the user to move again
    * the slide before it finish moving.
  */
  moveBackward = () => {
    /* Disable movement when reach the beginning except when infinite is active */
    if (this.state.enableClick && (this.state.currentSlide > 0 || this.props.infinite)) {
      this.slideTo('prev');
      this.move('left');
      this.setState({ enableClick: false });
    }
  }

  /**
    * Move slide forward.
    * Update the current position and
    * disable click to prevent the user to move again
    * the slide before it finish moving.
  */
  moveForward = () => {
    /* Disable movement when reach the end except when infinite is active */
    if (this.state.enableClick && (!this.isLastSlide() || this.props.infinite)) {
      this.slideTo('next');
      this.move();
      this.setState({ enableClick: false });
    }
  }

  /**
    * Check if the current slide is the last visible slide
  */
  isLastSlide = () => {
    const isIt = this.state.currentSlide >= ((this.totalUniqueElements - this.slidesToShow));
    return isIt;
  };

  /**
    * Set the new current slide.
    *
    * @param {string} to Could be 'next' or 'prev'.
  */
  slideTo = (to) => {
    let { currentSlide } = this.state;
    if (to === 'next') currentSlide += 1;
    else if (to === 'prev') currentSlide -= 1;
    else currentSlide = to;
    /** TODO: Slide to an especific slide */
    this.setState({ currentSlide, enableClick: true }, () => {
      if (to === 'prev') this.props.onPreviousSlide(this.state.currentSlide);
      if (to === 'next') this.props.onNextSlide(this.state.currentSlide);
    });
  }

  /**
    * Animate the slide forward or backwards
    * depending of the variable "to".
    *
    * @param {string} to If 'left' translate in reverse.
  */
  move = (to = 'right') => {
    this.movingTo = to;
    let newDisplacement = this.displacement;
    if (!isNaN(to) && to > 0) {
      newDisplacement *= to;
    }
    if (to === 'left') { newDisplacement *= -1; }
    this.currentPosition -= newDisplacement;
    this.slidesContainer.style.transition = 'transform 0.4s ease-in';
    this.slidesContainer.style.transform = `translateX(${this.currentPosition}px)`;
  }

  /**
    * Reset the position of the slide to the
    * beginning or to the end.
    *
    * @param {string} direction Could be 'start' or 'end'.
  */
  resetPositionTo = (direction) => {
    let newPosition = 0;
    if (direction === 'start') {
      newPosition = -(this.displacement * (this.slidesToShow));
    } else if (direction === 'end') {
      newPosition = -(this.displacement * (this.totalUniqueElements + this.slidesToShow - 1));
    }

    this.currentPosition = newPosition;
    this.slidesContainer.style.transition = 'transform 0s ease-in';
    this.slidesContainer.style.transform = `translateX(${this.currentPosition}px)`;
  }

  /**
    * Reset the current slide index
  */
  resetCurrentSlide = () => {
    let newSlide = 0;
    if (this.state.currentSlide < 0) {
      newSlide = this.totalUniqueElements - 1;
    } else if (this.state.currentSlide < this.totalUniqueElements) {
      newSlide = this.state.currentSlide;
    }
    this.setState({ currentSlide: newSlide });
  }

  /**
    * If the first slide shown is the first and
    * the last slide shown is also the last of all,
    * then it means all slides are visible.
  */
  hasAllItemsVisible = () => this.state.currentSlide === 0 && this.isLastSlide();

  /**
    * Get the children elements.
    * Calculate the width of the slides,
    * add the clones (if infinite is enabled) and render all the slides.
  */
  renderSlides = (children) => {
    const { slidesToShow, slideWidth, gap, infinite, responsive } = this.props;
    this.slidesToShow = slidesToShow;
    this.setResizeBreakpoint();
    if (responsive && this.currentBreakpoint) {
      this.slidesToShow = responsive[this.currentBreakpoint];
    }
    /* It needs to pass the children to the "toArray" react function, because
     * if there is only one child, it won't be an array of one.
     */
    const slides = React.Children.toArray(children);
    const clientWidth = R.path(['clientWidth'], this.slideshow) || 0;
    const slideshowClientWidth = clientWidth >= 0 ? clientWidth : this.slideshowClientWidth;
    const autoWidth = ((slideshowClientWidth + gap) / this.slidesToShow) - gap;
    this.displacement = (slideWidth || autoWidth) + gap;
    this.slideshowWidth = this.displacement * (this.totalSlides || 1);

    if (infinite) {
      this.addClones(slides, this.slidesToShow);
    }
    return (
      <SlidesContainer
        className="light-carousel-slides-container"
        slideContainerRef={(el) => { this.slidesContainer = el; }}
        slideshowWidth={this.slideshowWidth}
      >
        {slides.map((slide, index) => (
          <Slide
            key={index}
            className="light-carousel-slide"
            autoWidth={autoWidth}
            slideWidth={slideWidth}
            gap={gap}
          >
            {slide}
          </Slide>
        ))}
      </SlidesContainer>
    );
  }

  render() {
    const {
      prevBtn,
      nextBtn,
      showControls,
      slideshowStyle,
      containerStyle,
      buttonsContainerStyle,
      infinite,
      className,
      children,
    } = this.props;

    return (
      <LightCarouselContainer
        className={`light-carousel ${className}`}
        containerStyle={containerStyle}
      >
        <Slideshow
          className="light-carousel-slideshow"
          slideshowStyle={slideshowStyle}
          slideshowRef={(el) => { this.slideshow = el; }}
        >
          {this.renderSlides(children)}
        </Slideshow>
        {(showControls && !this.hasAllItemsVisible()) &&
          <ButtonsContainer
            className="light-carousel-buttons-container"
            buttonsContainerStyle={buttonsContainerStyle}
          >
            <Button
              className={`light-carousel-button move-prev ${(this.state.currentSlide === 0 && !infinite) ? 'disabled' : ''}`}
              onClick={() => this.moveBackward()}
            >
              {prevBtn}
            </Button>
            <Button
              className={`light-carousel-button move-next ${(this.isLastSlide() && !infinite) ? 'disabled' : ''}`}
              onClick={() => this.moveForward()}
            >
              {nextBtn}
            </Button>
          </ButtonsContainer>
        }
      </LightCarouselContainer>
    );
  }
}

LightCarousel.propTypes = {
  children: PropTypes.node,
  /* Number of items to display */
  slidesToShow: PropTypes.number,
  /* Index of the slide to show at the beginning */
  setSlide: PropTypes.number,
  /* Width in pixels of every slide */
  slideWidth: PropTypes.number,
  /* Margin between slides */
  gap: PropTypes.number,
  /* If true, the slide will move automatically */
  autoplay: PropTypes.bool,
  /* Speed of the autoplay */
  speed: PropTypes.number,
  /* Stops the animation when hover */
  stopOnHover: PropTypes.bool,
  /* Makes the slideshow infinite */
  infinite: PropTypes.bool,
  /* Render or not the prev or next buttons */
  showControls: PropTypes.bool,
  /* Content of the previous button */
  prevBtn: PropTypes.node,
  /* Content of the next button */
  nextBtn: PropTypes.node,
  onPreviousSlide: PropTypes.func,
  onNextSlide: PropTypes.func,
  /* Allow the user to set the number of slides to show for
   * a given breakpoint.
   */
  responsive: PropTypes.object,
  className: PropTypes.string,
  slideshowStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  containerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
  buttonsContainerStyle: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.string,
  ]),
};

LightCarousel.defaultProps = {
  children: [],
  slidesToShow: 1,
  setSlide: 0,
  slideWidth: null,
  gap: 0,
  autoplay: false,
  speed: 3000,
  stopOnHover: true,
  infinite: false,
  showControls: false,
  prevBtn: 'prev',
  nextBtn: 'next',
  onPreviousSlide: () => { },
  onNextSlide: () => { },
  className: '',
  responsive: {},
  slideshowStyle: {},
  containerStyle: {},
  buttonsContainerStyle: [],
};

export default LightCarousel;
