// Main Slider
const mainSlider = new Swiper(".visual .swiper", {
  //direction: 'vertical',
  loop: true,
  slidesPerView: 1,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false, //컨트롤 후에도 autoplay 작동
  },

  pagination: {
    el: ".swiper-pagination",
    clickable: true,
    type: "fraction",
  },

  navigation: {
    prevEl: ".swiper-button-prev",
    nextEl: ".swiper-button-next",
  },
});

// 멈춤, 재생
const sliderPlayBtn = document.querySelector(
  ".visual_slider_control .btn_play"
);

sliderPlayBtn.addEventListener("click", (e) => {
  e.preventDefault;

  if (sliderPlayBtn.classList.contains("on")) {
    sliderPlayBtn.classList.remove("on");
    mainSlider.autoplay.start();
  } else {
    sliderPlayBtn.classList.add("on");
    mainSlider.autoplay.stop();
  }
});

// 탑 버튼
document.querySelector(".top_btn").addEventListener("click", (e) => {
  e.preventDefault();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

// 빈 링크 클릭 방지
document.querySelectorAll("a[href='#']").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("prevented!");
  });
});
