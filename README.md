# Biliver

Biliver, farklı bilgi alanlarında kullanıcıların kendilerini test edebileceği, mobil uyumlu ve web tabanlı bir bilgi oyunudur.

Oyuncular bir oyun modu ve zorluk seviyesi seçerek 10 soruluk turlara katılabilir. Her soru belirli bir süre içinde cevaplanır; doğru cevaplarla puan ve doğru seri kazanılır.

Proje, yeni oyun modlarının mevcut oyun motoru değiştirilmeden kolayca eklenebileceği modüler bir yapı üzerine geliştirilmiştir.

## Canlı Demo

Biliver'i GitHub Pages üzerinden deneyebilirsiniz:

https://iamyunusemreozgel.github.io/Biliver/

## Oyun Yapısı

Her oyun turu 10 sorudan oluşur.

Oyuncu, oyuna başlamadan önce üç farklı zorluk seviyesinden birini seçebilir:

| Seviye | Seçenek Sayısı | Soru Süresi |
| --- | ---: | ---: |
| Kolay | 2 | 15 saniye |
| Orta | 3 | 10 saniye |
| Zor | 4 | 5 saniye |

Her doğru cevap oyuncuya 10 puan kazandırır.

Arka arkaya verilen doğru cevaplar doğru seri göstergesine eklenir. Yanlış cevap verildiğinde veya süre dolduğunda doğru cevap gösterilir ve seri sıfırlanır.

## Oyun Modları

Biliver içerisinde şu anda farklı alanlarda oyun modları bulunmaktadır:

### Coğrafya

- **Plaka Kodları:** Plaka kodlarını Türkiye şehirleriyle eşleştirme
- **Dünya Başkentleri:** Ülkeleri başkentleriyle eşleştirme
- **Dünya Para Birimleri:** Ülkeleri kullandıkları para birimleriyle eşleştirme
- **Dünya Bayrakları:** Gösterilen bayrağın ait olduğu ülkeyi bulma
- **Ülkeler ve Kıtalar:** Ülkelerin bulunduğu kıtayı belirleme
- **Şehirler ve Bölgeler:** Türkiye şehirlerini coğrafi bölgeleriyle eşleştirme
- **Dünya Simgeleri:** Ünlü eser ve yapıları bulundukları şehirlerle eşleştirme
- **Dağlar ve İller:** Türkiye'deki önemli dağları özdeşleştikleri illerle eşleştirme
- **Dünya Dağları:** Dünyanın önemli dağlarını bulundukları ülkelerle eşleştirme
- **Türkiye İlçeleri:** İlçeleri bağlı oldukları şehirlerle eşleştirme
- **İlçe Nüfusları:** İlçeleri nüfus değerleriyle eşleştirme

### Bilim

- **Elementler ve Semboller:** Element sembollerini doğru elementlerle eşleştirme
- **Birimler ve Büyüklükler:** Ölçü birimlerini ifade ettikleri fiziksel büyüklüklerle eşleştirme
- **Kimyasal Formüller:** Kimyasal formülleri doğru bileşiklerle eşleştirme

### Tarih ve Kültür

- **Antik Uygarlıklar:** Uygarlıkları ana merkezleri veya geliştikleri bölgelerle eşleştirme

### Sanat ve Edebiyat

- **Filmler ve Yönetmenler:** Filmleri yönetmenleriyle eşleştirme
- **Kitaplar ve Yazarlar:** Kitapları yazarlarıyla eşleştirme

## Kullanılan Teknolojiler

- HTML5
- CSS3
- Vanilla JavaScript
- JavaScript Modules
- SVG
- Responsive Web Design
- GitHub Pages

## Sayfalar

| Sayfa | Açıklama |
| --- | --- |
| Ana Sayfa | Biliver'in tanıtımı ve oyun modlarına yönlendirme |
| Oyun Modları | Aktif oyun kategorilerini listeleme |
| Oyun | Mod ve zorluk seçimiyle bilgi turunu oynama |
| Nasıl Oynanır? | Oyun kurallarını, süreleri ve puanlama sistemini açıklama |

## Dosya Yapısı

```text
Biliver/
│
├── index.html
├── README.md
│
├── pages/
│   ├── game.html
│   ├── modes.html
│   └── how-to-play.html
│
└── assets/
    ├── css/
    │   ├── style.css
    │   ├── game.css
    │   ├── modes.css
    │   └── how-to-play.css
    │
    ├── images/
    │   ├── brand/
    │   └── flags/
    │
    └── js/
        ├── config/
        │   └── modes.js
        │
        ├── data/
        │   ├── plates.js
        │   ├── capitals.js
        │   ├── currencies.js
        │   ├── flags.js
        │   ├── elements.js
        │   ├── units.js
        │   ├── ancient-civilizations.js
        │   └── chemical-formulas.js
        │
        └── game/
            └── quiz-engine.js
```

