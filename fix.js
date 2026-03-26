const fs = require('fs');
const files = ['ModernShopTemplate.tsx', 'ClassicStoreTemplate.tsx', 'MinimalBoutiqueTemplate.tsx', 'BoldMarketTemplate.tsx'].map(f => 'components/templates/' + f);
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/config\?\.theme\?\.primaryColor \|\| primaryColor/, 'config?.theme?.primaryColor || brandSettings.primaryColor');
  c = c.replace(/config\?\.theme\?\.secondaryColor \|\| secondaryColor/, 'config?.theme?.secondaryColor || brandSettings.secondaryColor');
  c = c.replace(/config\?\.content\?\.heroHeadline \|\| headline/, 'config?.content?.heroHeadline || brandSettings.businessName');
  c = c.replace(/config\?\.content\?\.heroSubheadline \|\| subheadline/, 'config?.content?.heroSubheadline || brandSettings.tagline');
  fs.writeFileSync(f, c);
});
console.log('Done fixing');
