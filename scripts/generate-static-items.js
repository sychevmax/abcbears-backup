const fs = require('fs');
const path = require('path');

const data = require('../data/data.json');

// Read templates
const templateEn = fs.readFileSync(path.join(__dirname, '../shopitem_light.html'), 'utf8');
const templateRu = fs.readFileSync(path.join(__dirname, '../ru/shopitem_light.html'), 'utf8');

// Helper to escape HTML (for text fields)
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Render a single item page
function renderItemPage(item, collection, lang, template) {
  // Get first photo or fallback
  const photos = (item.photos[lang] && item.photos[lang].length > 0)
    ? item.photos[lang]
    : (item.photos['ru'] && item.photos['ru'].length > 0 ? item.photos['ru'] : []);
  const firstPhoto = photos[0] || '';

  // Compose HTML for all photos
  const photosHtml = photos.map((photo, idx) =>
    `<img src="${photo}"${idx === 0 ? ' style="max-width:100%;"' : ' class="margin5pxLeftRight"'} />`
  ).join('\n');

  // Compose price HTML
  const price = item.price[lang] || '';
  const sale = item.sale && item.sale[lang] ? `<span class="sale">${item.sale[lang]}</span>` : '';
  const priceHtml = price
    ? `<div class="price"><span>${lang === 'ru' ? 'Цена:' : 'Price:'} </span><span${sale ? ' class="oldPrice"' : ''}>${price}</span>${sale}</div>`
    : '';

  // Compose details HTML
  const detailsHtml = item.item_shop_details && item.item_shop_details[lang]
    ? `<div>${item.item_shop_details[lang]}</div>`
    : '';

  // Compose sold/reserved HTML
  let soldHtml = '';
  if (item.settings.reserved || item.settings.sold) {
    soldHtml = `<div>${escapeHtml(item.item_title[lang])} ${item.settings.sold ? (lang === 'ru' ? 'находится в частной коллекции.' : 'is already adopted.') : (lang === 'ru' ? 'зарезервирован.' : 'is reserved.')}</div>`;
  }

  // Compose main content
  let content = `
    <img src="${firstPhoto}" style="max-width:100%;" />
    <div class="threeImages">${photosHtml}</div>
    <h3>${escapeHtml(item.item_title[lang])}</h3>
    <div>${item.item_description[lang] || ''}</div>
    ${priceHtml}
    ${detailsHtml}
    ${soldHtml}
  `;

  // Replace Angular blocks with static content
  let html = template
    .replace(/<div ng-controller="ShopItemController">[\s\S]*?<\/div>\s*<!--? ?end static item ?--?>?/i, content)
    // fallback: replace the whole controller block if above fails
    .replace(/<div ng-controller="ShopItemController">[\s\S]*?<\/div>/i, content);

  // Optionally, set <title>
  html = html.replace(/<title>.*?<\/title>/, `<title>${escapeHtml(item.item_title[lang])} | ABCbears</title>`);

  return html;
}

// Generate static pages for all items
data.forEach(collection => {
  collection.items.forEach(item => {
    if (!item.settings.isPublic) return;
    // English
    if (!item.settings.onlyRussian) {
      const outDir = path.join(__dirname, '..', 'shop', collection.collection_id);
      fs.mkdirSync(outDir, { recursive: true });
      const html = renderItemPage(item, collection, 'en', templateEn);
      fs.writeFileSync(path.join(outDir, `${item.item_id}.html`), html, 'utf8');
    }
    // Russian
    if (item.photos['ru'] && item.item_title['ru']) {
      const outDir = path.join(__dirname, '..', 'ru', 'shop', collection.collection_id);
      fs.mkdirSync(outDir, { recursive: true });
      const html = renderItemPage(item, collection, 'ru', templateRu);
      fs.writeFileSync(path.join(outDir, `${item.item_id}.html`), html, 'utf8');
    }
  });
});

console.log('Static item pages generated.');
