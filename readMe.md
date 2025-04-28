


# Bindable HTML Rendering Framework

Ankeon, modern ve hızlı HTML uygulamaları geliştirmek için oluşturulmuş,  
**Türk kültüründen ilham alan** minimalist bir data-binding ve event yönetim framework'üdür.

## ✨ Özellikler

- Gerçek DOM üzerinde hızlı ve hafif binding işlemleri
- Türkçe karakterler ve ₺ simgesi ile doğal uyum
- One-way, Two-way ve Event tabanlı binding desteği
- Koleksiyonlar üzerinde ₺for yapısıyla döngü işlemleri
- Event Handling için ₺ karakteriyle basit event bağlama
- Küçük ve büyük ölçekli projelere uygun çekirdek yapı

---

## 🚀 Başlangıç

### Kurulum

Şu anda doğrudan `<script>` etiketi ile kullanılabilir:

```html
<script src="ankeon.min.js"></script>
```


## 🛠️ Kullanım

### 1. Değişken Binding (One-way)

Verileri HTML içerisine ₺₺ ... ₺₺ kullanarak bağlayın:

```html
<div>Paket Adı: ₺₺ package.name ₺₺</div>
```


### 1. Değişken Binding (One-way)

Verileri HTML içerisine ₺₺ ... ₺₺ kullanarak bağlayın:

```html
<div>Paket Adı: ₺₺ package.name ₺₺</div>
```


### 2. Koleksiyon Döngüsü (₺for)

Diziler üzerinde ₺for kullanarak döngü oluşturun:

```html
<ul>
  ₺for(package.dependencies, item){
    <li>₺₺ item ₺₺</li>
  }
</ul>
```

### 3. Event Binding (₺event)

Olayları doğrudan ₺eventName şeklinde bağlayın:

```html
<button ₺onclick="updatePackage()">Güncelle</button>
```

### 4. Dinamik Obje Özelliği Erişimi

Nesne içindeki dinamik property isimlerine erişin:
```html
<span>₺₺ item.₺.prop[0] ₺₺</span>
```

## ⚙️ Teknik Detaylar

- Ankeon, doğrudan gerçek DOM üzerinde çalışır, sanal DOM kullanmaz.
- ₺₺ ile belirlenen alanlar otomatik taranır ve veri ile eşleştirilir.
- Event binding (₺onclick gibi) attribute üzerinden tanımlanır ve dinamik olarak atanır.
- ₺for yapısı ile döngüler compile-time çözülür ve hızlı render edilir.
- ₺ karakteri, Ankeon'un özel işlem simgesidir ve sistem içi ayırt edici rol oynar.
- Binding, küçük değişikliklerde yalnızca ilgili alanı günceller (partial update).

## 🎯 Ankeon'un Felsefesi

- Minimalist Yaklaşım: Gereksiz soyutlamalardan kaçınır.
- Türkçe Duyarlılığı: ₺ simgesi ve Türk yazılım kültürüne özgü detaylarla yerel uyum sağlar.
- Yüksek Performans: En hızlı sonucu almak için optimize edilmiş çekirdek yapı.
- Okunabilirlik: HTML ve veri arasındaki bağı olabildiğince doğal ve görünür kılar.

## 🛤️ Yol Haritası
 - One-way data binding (₺₺)
 - ₺for döngüsü
 - Event binding (₺onclick vb.)
 - Dinamik property erişimi (item.₺.prop[0])
 - Two-way data binding (₺model)
 - Watcher sistemi ile reaktif güncellemeler
 - Modüler Plugin Desteği
 - Ankeon CLI aracı
 - Gelişmiş error handling mekanizması

 ## 🛡️ Lisans
 - Bu proje MIT lisansı ile lisanslanmıştır.
 - Dilediğiniz gibi kullanabilir, değiştirebilir ve dağıtabilirsiniz.