# Task Management App - React Native

Modern bir görev yönetimi uygulaması. React Native, Expo, TypeScript ve NativeWind kullanılarak geliştirilmiştir.

## 🚀 Özellikler

### ✅ Temel Özellikler
- **Görev Yönetimi**: Görev oluşturma, düzenleme, silme ve tamamlama
- **Liste Yönetimi**: Görevleri kategorilere ayırma
- **Arama ve Filtreleme**: Görevleri arama ve filtreleme
- **Gerçek Zamanlı Güncellemeler**: Anlık veri senkronizasyonu

### 🎨 UI/UX Özellikleri
- **Modern Tasarım**: NativeWind ile responsive ve modern arayüz
- **Animated**: Filtreleme için animasyonlu akordiyon tasarım
- **Pull-to-Refresh**: Aşağı çekerek yenileme
- **Loading States**: Tüm async işlemler için loading göstergeleri
- **Error Handling**: Kullanıcı dostu hata yönetimi

### 🔧 Teknik Özellikler
- **TypeScript**: Tam tip güvenliği
- **Zod**: Runtime validation ve type safety
- **Zustand**: Global state yönetimi
- **Drizzle ORM**: Type-safe database işlemleri
- **SQLite**: Yerel veritabanı
- **Expo Router**: File-based navigation

## 📱 Ekranlar

- **Ana Sayfa**: Görev özeti ve hızlı erişim
- **Görevler**: Tüm görevlerin listesi
- **Görev Detayı**: Görev düzenleme ve detayları
- **Görev Oluşturma**: Yeni görev ekleme
- **Listeler**: Kategori yönetimi

## 🛠️ Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Veritabanı şemasını oluştur
npm run generate-schema

# Uygulamayı başlat
npm start
```

## 🏗️ Proje Yapısı

```
├── app/                 # Expo Router sayfaları
├── components/          # Yeniden kullanılabilir bileşenler
├── hooks/              # Custom React hooks
├── queries/            # API sorguları
├── store/              # Zustand state yönetimi
├── db/                 # Veritabanı şeması
└── utils/              # Yardımcı fonksiyonlar
```

## 🎯 Kullanılan Teknolojiler

- **React Native** - Mobil uygulama framework'ü
- **Expo** - Geliştirme platformu
- **TypeScript** - Tip güvenliği
- **Zod** - Runtime validation
- **NativeWind** - Tailwind CSS for React Native
- **Zustand** - State yönetimi
- **Drizzle ORM** - Veritabanı ORM
- **SQLite** - Yerel veritabanı

## 📋 Özellik Detayları

### Async İşlem Yönetimi
- Tüm API çağrıları için loading states
- Error handling ve kullanıcı bildirimleri
- Optimistic updates
- Pull-to-refresh functionality

### Data Validation
- Zod ile runtime validation
- Form input validation
- Type-safe data parsing
- Error message handling

### State Yönetimi
- Zustand ile global state
- Local component state
- Async data fetching hooks

### UI/UX
- Responsive tasarım
- Smooth animasyonlar
- Modern glassmorphism efektleri
- Consistent color scheme

## 🚀 Geliştirme

```bash
# Development server başlat
npm start

# iOS simülatörde çalıştır
npm run ios

# Android emülatörde çalıştır
npm run android

# Web'de çalıştır
npm run web
```

## 📝 Notlar

- Veritabanı şeması değiştirilmemelidir
- API fonksiyonları simüle edilmiş network latency içerir
- Tüm async işlemler proper error handling ile yönetilir