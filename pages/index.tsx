import React from 'react';

export default function Home() {
  const [brand, setBrand] = React.useState<any>(null);

  React.useEffect(() => {
    const data = process.env.NEXT_PUBLIC_BRAND_DATA;
    if (data) {
      try {
        setBrand(JSON.parse(data));
      } catch (e) {
        console.error('Failed to parse brand data', e);
      }
    }
  }, []);

  if (!brand) return <div className="flex items-center justify-center min-h-screen bg-gray-100">Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4" style={{ backgroundColor: brand.colorPalette?.primary || '#ffffff' }}>
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-8 text-center">
          {brand.logoUrl && (
            <img src={brand.logoUrl} alt="Logo" className="w-24 h-24 mx-auto mb-6 rounded-full shadow-md" />
          )}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{brand.brandName}</h1>
          <p className="text-xl text-gray-600 italic mb-8">{brand.tagline}</p>
          {brand.heroImageUrl && (
            <img src={brand.heroImageUrl} alt="Hero" className="w-full h-64 object-cover rounded-lg shadow-lg mb-8" />
          )}
          <button 
            className="px-8 py-3 rounded-full text-white font-bold text-lg transition-transform hover:scale-105"
            style={{ backgroundColor: brand.colorPalette?.secondary || '#000000' }}
          >
            Shop Now
          </button>
        </div>
      </div>
    </div>
  );
}
