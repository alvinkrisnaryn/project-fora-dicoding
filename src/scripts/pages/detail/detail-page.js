import UrlParser from '../utils/url-parser.js';

const url = UrlParser.parseActiveUrlWithoutCombiner(); // Parsing ID dari URL
const restaurantId = url.id; // Ambil ID restoran

async function fetchRestaurantData(id) {
  try {
    const response = await fetch(`https://story-api.dicoding.dev/v1/restaurants/${id}`);
    if (!response.ok) throw new Error('Data tidak ditemukan');
    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}

async function renderDetailPage() {
  const restaurant = await fetchRestaurantData(restaurantId);

  const detailContainer = document.querySelector('#restaurant-detail');
  if (restaurant) {
    detailContainer.innerHTML = `
      <h1>${restaurant.name}</h1>
      <img src="${restaurant.pictureUrl}" alt="${restaurant.name}" class="restaurant-image">
      <p>${restaurant.description}</p>
      <p><strong>Alamat:</strong> ${restaurant.address}</p>
    `;
  } else {
    detailContainer.innerHTML = '<p>Data restoran tidak ditemukan.</p>';
  }
}

// Panggil fungsi render saat halaman dimuat
renderDetailPage();
