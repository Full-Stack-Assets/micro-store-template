export interface ColorPalette {
  primary: string;
  secondary: string;
}

export interface BrandData {
  brandName: string;
  tagline: string;
  logoUrl?: string;
  heroImageUrl?: string;
  colorPalette: ColorPalette;
}
