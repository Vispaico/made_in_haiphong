import nextConfig from "eslint-config-next";

const sanitizedNextConfig = nextConfig.map((config) => {
  if (config.rules && "@typescript-eslint/no-require-imports" in config.rules) {
    const { "@typescript-eslint/no-require-imports": _removed, ...restRules } = config.rules;
    return {
      ...config,
      rules: restRules,
    };
  }
  return config;
});

const eslintConfig = [...sanitizedNextConfig];

export default eslintConfig;
