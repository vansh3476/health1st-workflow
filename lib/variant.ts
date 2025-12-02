type VariantOptions = Record<string, string>;

interface VariantsConfig {
  variants: {
    variant: VariantOptions;
    size: VariantOptions;
  };
  defaultVariants: {
    variant: string;
    size: string;
  };
}

export interface VariantProps {
  variant?: string;
  size?: string;
  className?: string;
}

export function variants(base: string, options: VariantsConfig) {
  return ({ variant, size, className }: VariantProps = {}) => {
    const finalVariant =
      options.variants.variant[variant ?? options.defaultVariants.variant] || "";

    const finalSize =
      options.variants.size[size ?? options.defaultVariants.size] || "";

    return [base, finalVariant, finalSize, className]
      .filter(Boolean)
      .join(" ");
  };
}
