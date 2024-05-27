import { S as e, A as s, N as t, P as r } from "./vendor.js";
(function () {
  const linkRelList = document.createElement("link").relList;
  if (!(linkRelList && linkRelList.supports && linkRelList.supports("modulepreload"))) {
    for (const linkElement of document.querySelectorAll('link[rel="modulepreload"]'))
      preloadModule(linkElement);
    new MutationObserver((mutations) => {
      for (const mutation of mutations)
        if ("childList" === mutation.type)
          for (const node of mutation.addedNodes)
            if ("LINK" === node.tagName && "modulepreload" === node.rel)
              preloadModule(node);
    }).observe(document, { childList: true, subtree: true });
  }

  function preloadModule(linkElement) {
    if (linkElement.ep) return;
    linkElement.ep = true;
    const fetchOptions = getFetchOptions(linkElement);
    fetch(linkElement.href, fetchOptions);
  }

  function getFetchOptions(linkElement) {
    const options = {};
    if (linkElement.integrity) options.integrity = linkElement.integrity;
    if (linkElement.referrerpolicy) options.referrerPolicy = linkElement.referrerpolicy;
    options.credentials = getCredentials(linkElement.crossorigin);
    return options;
  }

  function getCredentials(crossorigin) {
    if ("use-credentials" === crossorigin) return "include";
    if ("anonymous" === crossorigin) return "omit";
    return "same-origin";
  }
})();

const a = new e(".swiper", {
  modules: [
    s, // Module cho Pagination
    t, // Module cho Navigation
    r, // Module cho Autoplay
    function ({ swiper: swiperInstance, on: onEvent, extendParams: extendSwiperParams }) {
      extendSwiperParams({
        carouselEffect: { opacityStep: 0.33, scaleStep: 0.2, sideSlides: 2 },
      });

      onEvent("beforeInit", () => {
        if ("carousel" !== swiperInstance.params.effect) return;
        swiperInstance.classNames.push(`${swiperInstance.params.containerModifierClass}carousel`);
        const additionalParams = { watchSlidesProgress: true, centeredSlides: true };
        Object.assign(swiperInstance.params, additionalParams);
        Object.assign(swiperInstance.originalParams, additionalParams);
      });

      onEvent("progress", () => {
        if ("carousel" !== swiperInstance.params.effect) return;
        const { scaleStep, opacityStep } = swiperInstance.params.carouselEffect,
              maxSideSlides = Math.max(Math.min(swiperInstance.params.carouselEffect.sideSlides, 3), 1),
              scaleFactor = { 1: 2, 2: 1, 3: 0.2 }[maxSideSlides],
              translateFactor = { 1: 50, 2: 50, 3: 67 }[maxSideSlides],
              totalSlides = swiperInstance.slides.length;

        for (let i = 0; i < totalSlides; i++) {
          const slide = swiperInstance.slides[i],
                progress = slide.progress,
                absoluteProgress = Math.abs(progress);
          let dynamicScale = 1;
          if (absoluteProgress > 1) dynamicScale = 0.3 * (absoluteProgress - 1) * scaleFactor + 1;
          const animatedElements = slide.querySelectorAll(".swiper-carousel-animate-opacity"),
                translateX = progress * dynamicScale * translateFactor * (swiperInstance.rtlTranslate ? -1 : 1) + "%",
                scaleValue = 1 - absoluteProgress * scaleStep,
                zIndex = totalSlides - Math.abs(Math.round(progress));

          slide.style.transform = `translateX(${translateX}) scale(${scaleValue})`;
          slide.style.zIndex = zIndex;
          slide.style.opacity = absoluteProgress > maxSideSlides + 1 ? 0 : 1;
          animatedElements.forEach((el) => {
            el.style.opacity = 1 - absoluteProgress * opacityStep;
          });
        }
      });

      onEvent("setTransition", (swiperInstance, transitionDuration) => {
        if ("carousel" === swiperInstance.params.effect) {
          for (let i = 0; i < swiperInstance.slides.length; i++) {
            const slide = swiperInstance.slides[i],
                  animatedElements = slide.querySelectorAll(".swiper-carousel-animate-opacity");
            slide.style.transitionDuration = `${transitionDuration}ms`;
            animatedElements.forEach((el) => {
              el.style.transitionDuration = `${transitionDuration}ms`;
            });
          }
        }
      });
    },
  ],
  effect: "carousel",
  carouselEffect: { opacityStep: 0.33, scaleStep: 0.2, sideSlides: 2 },
  grabCursor: true,
  loop: true,
  loopAdditionalSlides: 1,
  slidesPerView: "auto",
  navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  // pagination: { el: ".swiper-pagination" },
  // autoplay: { delay: 3000 },
});

setTimeout(() => {
  console.log(a.slideTo(6, 1000, false))
}, 2000);
