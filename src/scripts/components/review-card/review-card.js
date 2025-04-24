export const createReviewCard = (review) => {
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <img src="${review.photoUrl}" alt="${review.name}" width="250" />
    <h3>${review.name}</h3>
    <p>${review.description}</p>
    <a href="#/detail/story-${review.id}">Lihat Selengkapnya</a>
  `;
  return card;
};
