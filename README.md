# React-Light-Carousel
A light weight react based carousel for multiple purposes.

## Features
* Autoplay
* Infinite mode
* Responsive (all the breakpoints you need)
* Custom buttons

## Install

```
  npm i react-light-carousel
```

## Basic usage

```js
const BasicCarousel = () => {
  return (
    <LightCarousel gap={20} showControls>
      <span>slide 1</span>
      <span>slide 2</span>
      <span>slide 3</span>
    </LightCarousel>
  );
}
```

## Responsive example

```js
const breakpoints = {
  0: 1, // Show 1 slide for default
  400: 2, // Show 2 slides after 400px
  1000: 4,  // Show 4 after 1000px
}

const ResponsiveCarousel = () => {
  return (
    <LightCarousel gap={20} responsive={breakpoints} showControls>
      <span>slide 1</span>
      <span>slide 2</span>
      <span>slide 3</span>
    </LightCarousel>
  );
}
```

## Props

| Name | Type | Default | Descrption |
|:----:|:----:|:-------:|:-----------|
| slidesToShow | number | 1 | The number of slides to show at the same time |
| setSlide | number | 0 | To set the slide you want to be focused (you can use it to set an initial slide)
| gap | number | 0 | The space between each slide
| autoplay | boolean | false | The slideshow starts moving automatically
| speed | number | 3000 | The speed of the autoplay
| stopOnHover | boolean | true | When true, stops the autoplay temporarily when the mouse is over the slideshow
| infinite | boolean | false | Makes the slideshow restart the slides when reaching the end
| showControls | boolean | false | To show the previous and next slide buttons
| prevBtn | string or component | 'prev' | The previous slide button
| nextBtn | string or component | 'next' | The next slide button
| responsive | object | {} | You can pass an object to tell the slideshow how many slides to show on a given breakpoint (in pixels)
| onPreviousSlide | function | () => {} | Callback when it finish sliding to previous slide
| onNextSlide | function | () => {} | Callback when it finish sliding to next slide