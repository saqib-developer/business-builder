const fs = require('fs');
const files = ['ModernShopTemplate.tsx', 'ClassicStoreTemplate.tsx', 'MinimalBoutiqueTemplate.tsx', 'BoldMarketTemplate.tsx'].map(f => 'components/templates/' + f);
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/export default function (\w+)\(\) \{/, 'import { TemplateConfig } from "@/lib/types/template";\n\nexport default function $1({ config }: { config?: TemplateConfig }) {');
  c = c.replace(/const \{ brandSettings \} = useBrand\(\);/, 'const { brandSettings } = useBrand();\n  const primaryColor = config?.theme?.primaryColor || brandSettings.primaryColor;\n  const secondaryColor = config?.theme?.secondaryColor || brandSettings.secondaryColor;\n  const headline = config?.content?.heroHeadline || brandSettings.businessName;\n  const subheadline = config?.content?.heroSubheadline || brandSettings.tagline;\n  const heroImage = config?.content?.heroImage;');
  c = c.replace(/TemplateLayout style="([^"]+)"/, 'TemplateLayout style="$1" config={config}');
  c = c.replace(/brandSettings\.primaryColor/g, 'primaryColor');
  c = c.replace(/brandSettings\.secondaryColor/g, 'secondaryColor');
  c = c.replace(/brandSettings\.tagline/g, 'subheadline');
  c = c.replace(/brandSettings\.businessName/g, 'headline');
  fs.writeFileSync(f, c);
});
console.log('Done refactoring');
