import fs from 'fs';

try {
  let pageStr = fs.readFileSync('app/onboarding/page.tsx', 'utf8');
  pageStr = pageStr.replace(
    /<Step5WebsiteBuilder(?:.|\n)*?\/>/m,
    `<Step5WebsiteBuilder
              businessName={onboardingData.businessName || "Your Business"}
              initialData={onboardingData.website}
              onNext={handleStep5Complete}
              onBack={() => setCurrentStep(4)}
            />`
  );
  fs.writeFileSync('app/onboarding/page.tsx', pageStr);

  let builderStr = fs.readFileSync('components/onboarding/Step5WebsiteBuilder.tsx', 'utf8');
  
  if (!builderStr.includes('initialData?: WebsiteSetup;')) {
    builderStr = builderStr.replace(
      /interface Step5WebsiteBuilderProps \{/,
      'interface Step5WebsiteBuilderProps {\n  initialData?: WebsiteSetup;'
    );
  }
  
  if (builderStr.includes('Step5WebsiteBuilderProps) {') && !builderStr.includes('initialData,')) {
    builderStr = builderStr.replace(
      /export default function Step5WebsiteBuilder\(\{[\s\S]*?\}\: Step5WebsiteBuilderProps\) \{/,
      'export default function Step5WebsiteBuilder({\n  businessName,\n  initialData,\n  onNext,\n  onBack,\n}: Step5WebsiteBuilderProps) {'
    );
  }

  builderStr = builderStr.replace(
    /const \[selectedOption, setSelectedOption\] = useState<[^>]+>\([^)]+\);/,
    'const [selectedOption, setSelectedOption] = useState<\'template\' | \'wordpress\' | \'custom\' | null>(initialData?.type && [\'template\', \'wordpress\', \'custom\'].includes(initialData.type) ? initialData.type as any : null);'
  );
  
  builderStr = builderStr.replace(
    /const \[selectedTemplateId, setSelectedTemplateId\] = useState<string \| null>\([^)]+\);/,
    'const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(\n    initialData?.templateId || null\n  );'
  );

  builderStr = builderStr.replace(
    /<Step5BCustomizer[\s\S]*?\/>/,
    `<Step5BCustomizer
          businessName={businessName}
          templateId={selectedTemplateId}
          initialConfig={initialData?.templateId === selectedTemplateId ? initialData?.config : undefined}
          onFinish={onNext}
          onBack={() => setMode("select")}
        />`
  );

  fs.writeFileSync('components/onboarding/Step5WebsiteBuilder.tsx', builderStr);

  let customizerStr = fs.readFileSync('components/onboarding/Step5BCustomizer.tsx', 'utf8');
  if(!customizerStr.includes('initialConfig?:')) {
    customizerStr = customizerStr.replace(
      /interface Step5BCustomizerProps \{/,
      'interface Step5BCustomizerProps {\n  initialConfig?: TemplateConfig;'
    );
    customizerStr = customizerStr.replace(
      /export default function Step5BCustomizer\(\{[\s\S]*?\}\: Step5BCustomizerProps\) \{/,
      'export default function Step5BCustomizer({\n  businessName,\n  templateId,\n  onFinish,\n  onBack,\n  initialConfig,\n}: Step5BCustomizerProps) {'
    );
    
    // Custom logic to handle setConfig replacement specifically.
    const regex = new RegExp(`const \\[config, setConfig\\] = useState<TemplateConfig>\\(\\{[\\s\\S]*?\\}\\);`, "m");
    
    customizerStr = customizerStr.replace(
      regex,
      `const [config, setConfig] = useState<TemplateConfig>({
      templateId: initialConfig?.templateId || templateId,
      theme: initialConfig?.theme || {
        primaryColor: "#3B82F6",
        secondaryColor: "#10B981",
      },
      content: initialConfig?.content || {
        heroHeadline: businessName || "My Business",
        heroSubheadline: "Welcome to our store. Discover amazing products.",
      },
    });`
    );
    fs.writeFileSync('components/onboarding/Step5BCustomizer.tsx', customizerStr);
  }

  console.log('Successfully updated the files.');
} catch (e) {
  console.log('Error updating:', e);
}
