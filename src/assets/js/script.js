///// 상품 데이터 가져오기
fetch("./data/products.json")
  .then((res) => res.json())
  .then((products) => {
    const productList = document.getElementsByClassName("product__list")[0];
    const categoryList = document.querySelector(".product__category-filter");
    const categoryItem = categoryList.querySelectorAll("button");
    let allProducts = products;

    function renderProducts(products) {
      productList.innerHTML = ""; // 기존 리스트 초기화

      // 상품 리스트 만들기
      products.forEach((product, i) => {
        const item = document.createElement("li");
        item.className = "product__item";

        const sizeOptions = product.options.size
          .map((s, i) => `<option value="${i}">${s.label}</option>`)
          .join("");

        item.innerHTML = `
        <a href="${product.link}">
          <div class="product__item-img">
              <img src="${product.image}" alt="${product.name}" />
          </div>
          <div class="product__item-info">
            <h3 class="product__item-name">${product.name}</h3>
            <p class="product__item-desc">${product.description}</p>
            <div class="product__item-option">
              <select name="size">${sizeOptions}</select>
            </div>
            <div class="product__item-price">₩<span class="price_value">${product.options.size[0].price.toLocaleString()}</span></div>
          </div>
        </a>
        <button class="product__item-cart-add flat-btn flat-btn--dark">장바구니 담기</button>
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

        // 장바구니 담기 버튼 클릭 시 로컬스토리지에 저장
        const cartAddBtn = item.querySelector(".product__item-cart-add");

        cartAddBtn.addEventListener("click", () => {
          const selectedSizeIndex = +select.value;
          const selectedSize = product.options.size[selectedSizeIndex];

          const cartItem = {
            name: product.name,
            size: selectedSize.label,
            price: selectedSize.price,
            image: product.image,
            quantity: 1,
          };

          let cart = JSON.parse(localStorage.getItem("cart")) || [];

          const existingItem = cart.find(
            (item) => item.name === cartItem.name && item.size === cartItem.size
          );

          if (existingItem) {
            existingItem.quantity += 1;
          } else {
            cart.push(cartItem);
          }

          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
          openCartDrawer();
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

///// 장바구니
const cartContainer = document.querySelector(".cart__list");
const cartTotal = document.querySelector(".cart__total");
const checkoutBtn = document.querySelector(".cart__checkout-button");
const cartNum = document.querySelectorAll(".cart__total-num");

// 장바구니 렌더링
function renderCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  // 초기화
  cartContainer.innerHTML = "";
  let totalPrice = 0;

  if (cart.length === 0) {
    cartContainer.innerHTML = `<li class="cart__item-empty">장바구니가 비어 있어요.</li>`;
    cartTotal.textContent = "";
    checkoutBtn.style.display = "none";

    cartNum.forEach((num) => {
      num.style.display = "none";
    });

    return;
  }

  // 총 상품 수량
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  document.querySelectorAll(".cart__total-num").forEach((num) => {
    num.textContent = `${totalQuantity}`;
    num.style.display = "block";
  });

  cart.forEach((item, index) => {
    const li = document.createElement("li");
    li.className = "cart__item";
    li.innerHTML = `
      <div class="cart__item-img">
        <img src="${item.image}" alt="${item.name}" />
      </div>
      <div class="cart__item-info">
        <h4 class="cart__item-name">${item.name}</h4>
        <p class="cart__item-option">사이즈: ${item.size}</p>
        <p class="cart__item-price">₩${item.price.toLocaleString()}</p>
      </div>
      <div class="cart__item-actions">
        <button class="cart__item-remove" data-index="${index}">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.33301 7.33301V10.6663M2.66634 3.99967H13.333L12.2797 13.4797C12.2436 13.8059 12.0884 14.1074 11.8438 14.3263C11.5993 14.5453 11.2826 14.6664 10.9543 14.6663H5.04501C4.71676 14.6664 4.40005 14.5453 4.15551 14.3263C3.91096 14.1074 3.75578 13.8059 3.71967 13.4797L2.66634 3.99967ZM4.89634 2.09767C5.00418 1.86899 5.17481 1.67567 5.38834 1.54028C5.60188 1.40489 5.8495 1.333 6.10234 1.33301H9.89701C10.15 1.33288 10.3977 1.40471 10.6114 1.5401C10.8251 1.6755 10.9958 1.86888 11.1037 2.09767L11.9997 3.99967H3.99967L4.89634 2.09767V2.09767ZM1.33301 3.99967H14.6663H1.33301ZM6.66634 7.33301V10.6663V7.33301Z" stroke="black" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <div class="cart__item-quantity">
          <button class="cart__qty-btn dec" data-index="${index}">-</button>
          <span class="cart__qty">${item.quantity}</span>
          <button class="cart__qty-btn inc" data-index="${index}">+</button>
        </div>
      </div>
    `;
    cartContainer.prepend(li);

    totalPrice += item.price * item.quantity;
  });

  cartTotal.innerHTML = `<span>Total</span><span>₩${totalPrice.toLocaleString()}</span>`;
  checkoutBtn.style.display = "block"; // 상품이 있으면 버튼 보임
}

renderCart();

// 장바구니 내 버튼 클릭
cartContainer.addEventListener("click", (e) => {
  // 감소 버튼 클릭
  const decBtn = e.target.closest(".cart__qty-btn.dec");
  if (decBtn) {
    const idx = +decBtn.dataset.index;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart[idx].quantity > 1) {
      cart[idx].quantity -= 1;
    } else {
      // 수량이 1일 때는 아예 항목 삭제
      cart.splice(idx, 1);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    return;
  }

  // 증가 버튼 클릭
  const incBtn = e.target.closest(".cart__qty-btn.inc");
  if (incBtn) {
    const idx = +incBtn.dataset.index;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    cart[idx].quantity += 1;

    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    return;
  }

  // 제품 삭제
  const removeBtn = e.target.closest(".cart__item-remove");
  if (removeBtn) {
    const idx = +removeBtn.dataset.index;
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(idx, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
  }
});

// 장바구니 여닫기
const cartDrawer = document.querySelector(".cart");
const cartOverlay = document.querySelector(".cart__overlay");
const cartOpenBtn = document.querySelector(".cart__open-button");
const cartCloseBtn = document.querySelector(".cart__close-button");
const body = document.body;

cartOpenBtn.addEventListener("click", openCartDrawer);
cartCloseBtn.addEventListener("click", closeCartDrawer);
cartOverlay.addEventListener("click", closeCartDrawer);

// 열기
function openCartDrawer() {
  body.classList.add("scroll-lock");
  cartDrawer.style.display = "flex";

  requestAnimationFrame(() => {
    cartDrawer.classList.add("active");
  });
}

// 닫기
function closeCartDrawer() {
  body.classList.remove("scroll-lock");
  cartDrawer.classList.remove("active");

  // 트랜지션 끝난 후 실행
  cartDrawer.addEventListener("transitionend", function handler(e) {
    if (e.propertyName === "transform") {
      cartDrawer.style.display = "none";
      cartDrawer.removeEventListener("transitionend", handler);
    }
    //console.log(e.propertyName);
  });
}

///// Main Slider
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
const sliderPlayBtn = document.querySelector(".visual__slider-control-play");

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

///// 탑 버튼
document.querySelector(".top-button").addEventListener("click", (e) => {
  e.preventDefault();

  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
});

///// 빈 링크 클릭 방지
document.querySelectorAll("a[href='#']").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("prevented!");
  });
});
