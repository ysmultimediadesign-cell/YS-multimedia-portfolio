window.PORTFOLIO_CONFIG = {
  supabaseUrl: "https://wrrpqngszaecbjgvgndy.supabase.co",
  supabaseAnonKey: "sb_publishable_yH0Pvw_nE9xMUv8wYNhsEQ_OIq_8NvV",
};

window.PORTFOLIO_CATEGORIES = {
  video: [
    { id: "lagn-patrika", label: "Lagn Patrika Videos" },
    { id: "digital-lagn-patrika", label: "Digital Lagn Patrika Videos" },
    { id: "engagement", label: "Engagement Videos" },
    { id: "grahdev", label: "Gaondev Videos" },
    { id: "ghana-bangdya", label: "Ghana Bangdya Videos" },
    { id: "kelvan", label: "Kelvan Videos" },
    { id: "supari", label: "Supari Videos" },
    { id: "mehendi", label: "Mehendi Videos" },
    { id: "haldi", label: "Haldi Videos" },
    { id: "wedding", label: "Wedding Day Videos" },
    { id: "gruhpravesh", label: "Gruhpravesh Videos" },
    { id: "reception", label: "Reception Videos" },
    { id: "pre-wedding", label: "Pre Wedding Videos" },
    { id: "couple-videos", label: "Couple Videos" },
    { id: "save-the-date", label: "Save The Date Videos" },
    { id: "birthday", label: "Birthday Videos" },
    { id: "anniversary", label: "Anniversary Videos" },
    { id: "baby-welcome", label: "Baby Welcome Videos" },
    { id: "namkaran-barse", label: "Namkaran ( Barse ) Videos" },
    { id: "shop-opening", label: "Shop Opening Videos" },
    { id: "new-car-delivery", label: "Car Delivery Videos" },
    { id: "vatpournima", label: "Vatpournima Videos" },
    { id: "new-home", label: "New Home Videos" },
    { id: "ys-designs", label: "YS Designs Videos" },
    { id: "jagran-gondhal", label: "Jagran-Gondhal Videos" },
    { id: "baby-shoot", label: "Baby Shoot" },
    { id: "model-shoot", label: "Model Shoot" },
  ],
  image: [
    { id: "wedding-cards", label: "Wedding Card Designs" },
    { id: "banners", label: "Banner Design" },
    { id: "social-media", label: "Social Media Graphics" },
    { id: "custom-graphics", label: "Custom Graphics" },
  ],
};

const supabaseUrl = window.PORTFOLIO_CONFIG.supabaseUrl.trim();
const supabaseAnonKey = window.PORTFOLIO_CONFIG.supabaseAnonKey.trim();

window.portfolioSupabase =
  supabaseUrl && supabaseAnonKey && window.supabase?.createClient
    ? window.supabase.createClient(supabaseUrl, supabaseAnonKey)
    : null;
