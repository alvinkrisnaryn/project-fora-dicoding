export const createReviewCard = (story) => {
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <img src="${story.photoUrl}" alt="Foto review oleh ${
    story.name
  }" width="200">
    <h3>${story.name}</h3>
    <p>${story.description.slice(0, 100)}...</p>
    <a href="#/detail/${story.id}">Lihat Selengkapnya</a>
    ${
      story.isFavorite
        ? '<span class="favorite-indicator">❤️ Favorit</span>'
        : ""
    }
  `;
  return card;
};
