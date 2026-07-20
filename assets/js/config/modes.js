import { plates } from '../data/plates.js';
import { capitals } from '../data/capitals.js?v=20260716-3';
import { currencies } from '../data/currencies.js?v=20260717-2';
import { flags } from '../data/flags.js?v=20260717-1';
import { continents } from '../data/continents.js?v=20260718-1';
import { cityRegions } from '../data/city-regions.js?v=20260718-1';
import { worldLandmarks } from '../data/world-landmarks.js?v=20260718-1';
import { turkeyMountains } from '../data/turkey-mountains.js?v=20260718-1';
import { worldMountains } from '../data/world-mountains.js?v=20260718-1';
import { elements } from '../data/elements.js?v=20260718-1';
import { chemicalFormulas } from '../data/chemical-formulas.js?v=20260719-1';
import { movies } from '../data/movies.js?v=20260718-1';
import { books } from '../data/books.js?v=20260718-1';
import { units } from '../data/units.js?v=20260718-1';
import { ancientCivilizations } from '../data/ancient-civilizations.js?v=20260719-1';
import { districts } from '../data/districts.js?v=20260717-1';

const difficultyRank = { easy: 1, medium: 2, hard: 3 };

function getItemsByDifficulty(items, difficultyId) {
  const selectedRank = difficultyRank[difficultyId];
  return items.filter((item) => difficultyRank[item.level] <= selectedRank);
}

const unambiguousDistricts = districts.filter((item) => !item.ambiguous);

export const modes = {
  plates: { id: 'plates', title: 'Plaka Kodları', description: 'Plaka kodlarını doğru şehirlerle eşleştir.', questionCount: 10, items: plates, getPrompt: (item) => `${item.code} plaka kodu hangi şehre aittir?`, getAnswer: (item) => item.city },
  capitals: { id: 'capitals', title: 'Dünya Başkentleri', description: '150 ülkeyi doğru başkentlerle eşleştir.', questionCount: 10, items: capitals, getItems: (difficultyId) => getItemsByDifficulty(capitals, difficultyId), getPrompt: (item) => `${item.country} ülkesinin başkenti hangisidir?`, getAnswer: (item) => item.capital },
  currencies: { id: 'currencies', title: 'Dünya Para Birimleri', description: '150 ülkeyi doğru para birimleriyle eşleştir.', questionCount: 10, items: currencies, getItems: (difficultyId) => getItemsByDifficulty(currencies, difficultyId), getPrompt: (item) => `${item.country} ülkesinin para birimi hangisidir?`, getAnswer: (item) => item.currency },
  flags: { id: 'flags', title: 'Dünya Bayrakları', description: '150 ülkenin bayrağını doğru ülkeyle eşleştir.', questionCount: 10, items: flags, getItems: (difficultyId) => getItemsByDifficulty(flags, difficultyId), getPrompt: (item) => ({ text: 'Bu bayrak hangi ülkeye aittir?', visual: { src: `../assets/images/flags/${item.code}.svg`, alt: 'Hangi ülkeye ait olduğu sorulan bayrak' } }), getAnswer: (item) => item.country },
  continents: { id: 'continents', title: 'Ülkeler ve Kıtalar', description: 'Ülkeleri bulundukları kıtalarla eşleştir.', questionCount: 10, items: continents, getItems: (difficultyId) => getItemsByDifficulty(continents, difficultyId), getPrompt: (item) => `${item.country} hangi kıtada yer alır?`, getAnswer: (item) => item.continent },
  cityRegions: { id: 'cityRegions', title: 'Şehirler ve Bölgeler', description: "Türkiye'nin şehirlerini coğrafi bölgeleriyle eşleştir.", questionCount: 10, items: cityRegions, getItems: (difficultyId) => getItemsByDifficulty(cityRegions, difficultyId), getPrompt: (item) => `${item.city} hangi coğrafi bölgede yer alır?`, getAnswer: (item) => item.region },
  worldLandmarks: { id: 'worldLandmarks', title: 'Dünya Simgeleri', description: 'Dünyaca ünlü eserleri ve yapıları bulundukları şehirlerle eşleştir.', questionCount: 10, items: worldLandmarks, getItems: (difficultyId) => getItemsByDifficulty(worldLandmarks, difficultyId), getPrompt: (item) => `${item.landmark} hangi şehirdedir?`, getAnswer: (item) => item.city },
  turkeyMountains: { id: 'turkeyMountains', title: 'Dağlar ve İller', description: "Türkiye'nin önemli dağlarını özdeşleştikleri illerle eşleştir.", questionCount: 10, items: turkeyMountains, getItems: (difficultyId) => getItemsByDifficulty(turkeyMountains, difficultyId), getPrompt: (item) => `${item.mountain} en çok hangi ilimizle özdeşleşir?`, getAnswer: (item) => item.city },
  worldMountains: { id: 'worldMountains', title: 'Dünya Dağları', description: 'Dünyanın önemli dağlarını bulundukları ülkelerle eşleştir.', questionCount: 10, items: worldMountains, getItems: (difficultyId) => getItemsByDifficulty(worldMountains, difficultyId), getPrompt: (item) => `${item.mountain} hangi ülkede bulunur?`, getAnswer: (item) => item.country },
  elements: { id: 'elements', title: 'Elementler ve Semboller', description: 'Element sembollerini doğru element adlarıyla eşleştir.', questionCount: 10, items: elements, getItems: (difficultyId) => getItemsByDifficulty(elements, difficultyId), getPrompt: (item) => `${item.symbol} hangi elementin sembolüdür?`, getAnswer: (item) => item.element },
  chemicalFormulas: { id: 'chemicalFormulas', title: 'Kimyasal Formüller', description: 'Kimyasal formülleri doğru bileşik adlarıyla eşleştir.', questionCount: 10, items: chemicalFormulas, getItems: (difficultyId) => getItemsByDifficulty(chemicalFormulas, difficultyId), getPrompt: (item) => `${item.formula} hangi bileşiğin kimyasal formülüdür?`, getAnswer: (item) => item.compound },
  movies: { id: 'movies', title: 'Filmler ve Yönetmenler', description: 'Filmleri doğru yönetmenlerle eşleştir.', questionCount: 10, items: movies, getItems: (difficultyId) => getItemsByDifficulty(movies, difficultyId), getPrompt: (item) => `${item.movie} filminin yönetmeni kimdir?`, getAnswer: (item) => item.director },
  books: { id: 'books', title: 'Kitaplar ve Yazarlar', description: 'Kitapları doğru yazarlarla eşleştir.', questionCount: 10, items: books, getItems: (difficultyId) => getItemsByDifficulty(books, difficultyId), getPrompt: (item) => `${item.book} kitabının yazarı kimdir?`, getAnswer: (item) => item.author },
  units: { id: 'units', title: 'Birimler ve Büyüklükler', description: 'Ölçü birimlerini ifade ettikleri fiziksel büyüklüklerle eşleştir.', questionCount: 10, items: units, getItems: (difficultyId) => getItemsByDifficulty(units, difficultyId), getPrompt: (item) => `${item.unit} (${item.symbol}) hangi fiziksel büyüklüğün birimidir?`, getAnswer: (item) => item.quantity },
  ancientCivilizations: { id: 'ancientCivilizations', title: 'Antik Uygarlıklar', description: 'Antik uygarlıkları merkezleri veya geliştiği bölgelerle eşleştir.', questionCount: 10, items: ancientCivilizations, getItems: (difficultyId) => getItemsByDifficulty(ancientCivilizations, difficultyId), getPrompt: (item) => `${item.civilization} uygarlığının ana merkezi veya geliştiği bölge hangisidir?`, getAnswer: (item) => item.region },
  districts: { id: 'districts', title: 'Türkiye İlçeleri', description: 'İlçeleri doğru şehirlerle eşleştir.', questionCount: 10, items: unambiguousDistricts, getItems: (difficultyId) => getItemsByDifficulty(unambiguousDistricts, difficultyId), getPrompt: (item) => `${item.district} hangi şehre bağlıdır?`, getAnswer: (item) => item.city },
  districtPopulations: { id: 'districtPopulations', title: 'İlçe Nüfusları', description: 'İlçeleri nüfuslarıyla eşleştir.', questionCount: 10, items: districts, getItems: (difficultyId) => getItemsByDifficulty(districts, difficultyId), getPrompt: (item) => `${item.district}, ${item.city} ilçesinin nüfusu kaçtır?`, getAnswer: (item) => item.population, formatAnswer: (value) => value.toLocaleString('tr-TR') }
};

export function getMode(modeId) {
  return modes[modeId] ?? null;
}