import "./globals.css";

export const metadata = {
  title: "كوميك ترجم — مترجم الكوميكس للعربية",
  description: "كشف فقاعات الحوار وترجمتها من الإنجليزية إلى العربية بالذكاء الاصطناعي",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;900&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
