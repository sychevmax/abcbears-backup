const fs = require('fs');
const path = require('path');

const data = require('../data/data.json');
const template = fs.readFileSync('../shopitem_light.html', 'utf8');

function renderItemPage(item, collection) {
  // Replace placeholders in template with item data
  // e.g., template.replace('{{title}}', item.item_title.en)
  // ...implement your rendering logic...
  return template
    .replace('{{title}}', item.item_title.en)
    .replace('{{description}}', item.item_description.en)
    // ...other replacements...
}

data.forEach(collection => {
  collection.items.forEach(item => {
    if (item.settings.isPublic) {
      const html = renderItemPage(item, collection);
      const dir = path.join('../shop', collection.collection_id);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `${item.item_id}.html`), html);
    }
  });
});
