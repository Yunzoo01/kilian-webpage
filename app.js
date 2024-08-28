//app.js

//#region partial contact
document.addEventListener("DOMContentLoaded", function () {
    // 현재 페이지의 위치를 기반으로 경로 설정
    let path = '';
    
    if (window.location.pathname.includes('/pages/')) {
        path = '../partials/';
    } else {
        path = 'partials/';
    }
  
    // partials/nav.html 가져오기
    fetch(`${path}nav.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('navbar-placeholder').innerHTML = data;
      })
      .catch(error => console.log('Navbar loading error:', error));
  
    // partials/footer.html 가져오기
    fetch(`${path}footer.html`)
      .then(response => response.text())
      .then(data => {
        document.getElementById('footer-placeholder').innerHTML = data;
      })
      .catch(error => console.log('Footer loading error:', error));
});
//#endregion


//#region index.html-slider
document.addEventListener('DOMContentLoaded', function() {
  const slider = document.querySelector('.slider');
  if (slider) {
      let slides = document.querySelectorAll('.product');
      const visibleSlides = 4; // 한 번에 보이는 슬라이드 수
      const totalSlides = slides.length;

      // 슬라이더 전체를 복사하여 앞뒤로 붙이기
      let slidesCloneBefore = slider.innerHTML; // 기존 슬라이드 전체 복사
      let slidesCloneAfter = slider.innerHTML; // 기존 슬라이드 전체 복사

      slider.innerHTML = slidesCloneBefore + slider.innerHTML + slidesCloneAfter; // 앞뒤로 슬라이드 추가

      slides = document.querySelectorAll('.product'); // 슬라이더에 있는 모든 항목 재정의
      let index = totalSlides; // 인덱스를 첫 번째 슬라이드로 설정

      // 슬라이더의 초기 위치를 설정하여 원래 슬라이드가 시작되는 위치로 이동
      slider.style.transform = `translateX(${-index * 100 / visibleSlides}%)`;

      document.querySelector('.next').addEventListener('click', () => {
        index++;
        slider.style.transition = 'transform 0.4s ease-in-out';
        slider.style.transform = `translateX(${-index * 100 / visibleSlides}%)`;

        // 복사된 슬라이드 끝에 도달했을 때 원래 슬라이드로 순간 이동
        if (index >= totalSlides * 2) {
          setTimeout(() => {
            slider.style.transition = 'none';
            index = totalSlides;
            slider.style.transform = `translateX(${-index * 100 / visibleSlides}%)`;
          }, 400);
        }
      });

      document.querySelector('.prev').addEventListener('click', () => {
        index--;
        slider.style.transition = 'transform 0.4s ease-in-out';
        slider.style.transform = `translateX(${-index * 100 / visibleSlides}%)`;

        // 복사된 슬라이드 앞에 도달했을 때 원래 슬라이드로 순간 이동
        if (index < totalSlides) {
          setTimeout(() => {
            slider.style.transition = 'none';
            index = totalSlides * 2 - 1;
            slider.style.transform = `translateX(${-index * 100 / visibleSlides}%)`;
          }, 400);
        }
      });

      document.querySelectorAll('.product img').forEach(img => {
        img.addEventListener('click', function() {
            const link = this.parentElement.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        });
    });

  } else {
      console.error('Slider element not found.');
  }
});

//#endregion


//#region perfumes.html -filters
document.addEventListener('DOMContentLoaded', function() {
  const productGrid = document.getElementById('productGrid');
  const fragranceFamilyFilter = document.getElementById('fragranceFamilies');
  const genderFilter = document.getElementById('gender');
  const sortFilter = document.getElementById('sort');

  fetch('/assets/perfume_list.csv')
      .then(response => response.text())
      .then(data => {
          const rows = data.split('\n').map(row => row.split(','));
          const headers = rows[0]; // 첫 번째 줄을 헤더로 사용
          const products = rows.slice(1).map(row => {
              let product = {};
              row.forEach((val, index) => {
                if (headers[index] !== undefined && val !== undefined) {
                  product[headers[index].trim()] = val.trim();
                } else {
                  console.error('Undefined header or value detected:', headers[index], val);
                }
              });
              return product; // return product 추가
          });

          displayProducts(products);

          fragranceFamilyFilter.addEventListener('change', () => filterProducts(products));
          genderFilter.addEventListener('change', () => filterProducts(products));
          sortFilter.addEventListener('change', () => filterProducts(products));
      });

  function displayProducts(products) {
      productGrid.innerHTML = '';

      products.forEach(product => {
        if (product !== undefined) {
            const gridItem = document.createElement('div');
            gridItem.classList.add('grid-item');

            // data-family와 data-name 속성 추가
            gridItem.setAttribute('data-family', product.Fragrance_Family);
            gridItem.setAttribute('data-name', product.Name);
            
            // 제품 아이템에 링크 추가
            const productLink = document.createElement('a');
            productLink.href = `/pages/${product.Nam}.html`; 

              gridItem.innerHTML = `
               <a href="/pages/${product.Name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html">
                  <img src="/assets/kilian/perfume_list/${product.Fragrance_Family}/${product.Name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-1.avif" alt="${product.Name}">
                  <h3>${product.Name.replace(/_/g, ' ')}</h3>
                  <h2>Price: $${product.Price}</h2>
                 </a>
              `;
      
              if (product.hasOwnProperty('soldOut') && product.soldOut === 'TRUE') {
                gridItem.classList.add('sold-out');
              }
              if (product.soldOut === 'TRUE') {
                  const soldOutText = document.createElement('p');
                  soldOutText.innerText = 'Sold Out';
                  gridItem.appendChild(soldOutText);
              }
      
              productGrid.appendChild(gridItem);
          } else {
              console.error('Undefined product detected:', product);
          }
      });
      addImageHoverEffect();
    }
  
    function filterProducts(products) {
        let filteredProducts = products;
  
        // Fragrance Family 필터 적용
        const selectedFragranceFamily = fragranceFamilyFilter.value;
        if (selectedFragranceFamily !== 'all') {
            filteredProducts = filteredProducts.filter(product => product['Fragrance_Family'] === selectedFragranceFamily);
        }
  
        // Gender 필터 적용
        const selectedGender = genderFilter.value;
        if (selectedGender !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.Gender === selectedGender);
        }
  
        // 정렬 옵션 적용
        const selectedSort = sortFilter.value;
        if (selectedSort === 'priceLowHigh') {
            filteredProducts.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
        } else if (selectedSort === 'priceHighLow') {
            filteredProducts.sort((a, b) => parseFloat(b.Price) - parseFloat(a.Price));
        } else if (selectedSort === 'bestSelling') {
            filteredProducts.sort((a, b) => parseFloat(b.Sales) - parseFloat(a.Sales));
        }
  
        // 필터링된 제품 리스트 출력
        displayProducts(filteredProducts);
    }

    function addImageHoverEffect() {
      document.querySelectorAll('.grid-item').forEach(item => {
          const img = item.querySelector('img');
          const family = item.getAttribute('data-family'); // Fragrance_Family 값 가져오기
          const name = item.getAttribute('data-name'); // Name 값 가져오기
  
          item.addEventListener('mouseover', () => {
              console.log(`Mouseover: Switching to /assets/kilian/perfume_list/${family}/${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-2.avif`);
              img.src = `/assets/kilian/perfume_list/${family}/${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-2.avif`; // 마우스 오버 시 변경될 이미지
          });
  
          item.addEventListener('mouseout', () => {
              console.log(`Mouseout: Switching back to /assets/kilian/perfume_list/${family}/${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-1.avif`);
              img.src = `/assets/kilian/perfume_list/${family}/${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}-1.avif`; // 원래 이미지로 복구
          });
      });
  }
});
//#endregion


document.addEventListener('DOMContentLoaded', function() {
    const thumbnails = document.querySelectorAll('.thumbnail');
    const productImage = document.querySelector('.product-image img');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            productImage.src = this.src;
        });
    });

    // 슬라이드의 좌우 버튼 클릭 시 이동하도록 설정
    let currentIndex = 0;
    const totalImages = thumbnails.length;

    document.querySelector('.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalImages;
        productImage.src = thumbnails[currentIndex].src;
    });

    document.querySelector('.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        productImage.src = thumbnails[currentIndex].src;
    });
});

