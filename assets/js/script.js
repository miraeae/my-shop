// 상품 데이터 가져오기
fetch("./assets/data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const productList = document.getElementsByClassName("product_list")[0];
    const categoryList = document.querySelector(".category_filter");
    const categoryItem = categoryList.querySelectorAll("button");
    let allProducts = products;

    function renderProducts(products) {
      productList.innerHTML = ""; // 기존 리스트 초기화

      // 상품 리스트 만들기
      products.forEach((product, i) => {
        const item = document.createElement("li");
        item.className = "product_item";

        const sizeOptions = product.options.size
          .map((s, i) => `<option value="${i}">${s.label}</option>`)
          .join("");

        item.innerHTML = `
        <a href="${product.link}">
          <div class="product_img">
              <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product_info">
            <h3 class="product_name">${product.name}</h3>
            <p class="product_desc">${product.description}</p>
            <div class="product_option">
              <select name="size">${sizeOptions}</select>
            </div>
            <div class="product_price">₩<span class="price_value">${product.options.size[0].price.toLocaleString()}</span></div>
          </div>
        </a>
        <button class="product_cart_add btn btn_dark">장바구니 담기</button>
      `;
        productList.appendChild(item);

        // 제품 순차적으로 서서히 나타나기
        setTimeout(() => {
          item.classList.add("show");
        }, i * 100);

        // 옵션에 따라 가격 변경
        const select = item.querySelector("select[name='size']");
        const priceTect = item.querySelector(".price_value");

        select.addEventListener("change", (e) => {
          const selected = product.options.size[+e.target.value]; // + = parseInt() // 문자열("0") -> 숫자(0)
          priceTect.textContent = selected.price.toLocaleString();
        });
      });
    }

    // 전체 상품 렌더링
    renderProducts(allProducts);

    // 카테고리 필터링
    categoryItem.forEach((item) => {
      item.addEventListener("click", () => {
        categoryItem.forEach((el) => el.classList.remove("active"));
        item.classList.add("active");

        const selectedCategory = item.dataset.category;
        const filtered =
          selectedCategory === "all"
            ? allProducts
            : allProducts.filter((p) => p.category === selectedCategory);

        renderProducts(filtered);
      });
    });
  });

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
