import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const SOURCE_BASE =
  'https://raw.githubusercontent.com/onurusluca/turkey-geo-api/main/data/jsonl';
const OUTPUT_PATH = resolve('assets/js/data/districts.js');

const turkishLocale = 'tr-TR';

function parseJsonLines(text) {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function toTitleCase(value) {
  return value
    .toLocaleLowerCase(turkishLocale)
    .replace(/(^|[\s'-])([a-zçğıöşü])/giu, (match, separator, letter) =>
      `${separator}${letter.toLocaleUpperCase(turkishLocale)}`
    );
}

async function fetchText(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`${url} alınamadı: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

function getDifficulty(population) {
  if (population >= 150000) {
    return 'easy';
  }

  if (population >= 40000) {
    return 'medium';
  }

  return 'hard';
}

function serializeDataset(districts) {
  const rows = districts.map((item) => `  ${JSON.stringify(item)}`).join(',\n');

  return `// Bu dosya scripts/generate-districts.mjs tarafından otomatik oluşturulmuştur.\n// Kaynak: onurusluca/turkey-geo-api (MIT), NVI ile Mart 2026 hizalaması.\n// Oyun motoruna veya mod yapılandırmasına otomatik olarak bağlanmaz.\n\nexport const districts = [\n${rows}\n];\n`;
}

async function main() {
  const provincesText = await fetchText(`${SOURCE_BASE}/provinces.jsonl`);
  const provinces = parseJsonLines(provincesText);
  const provinceById = new Map(provinces.map((province) => [province.id, province]));

  const districtGroups = await Promise.all(
    provinces.map(async (province) => {
      const districtText = await fetchText(
        `${SOURCE_BASE}/province-${province.id}/districts.jsonl`
      );

      return parseJsonLines(districtText);
    })
  );

  const rawDistricts = districtGroups.flat();
  const nameCounts = new Map();

  rawDistricts.forEach((district) => {
    const name = toTitleCase(district.name);
    nameCounts.set(name, (nameCounts.get(name) ?? 0) + 1);
  });

  const districts = rawDistricts
    .map((district) => {
      const province = provinceById.get(district.province_id);
      const districtName = toTitleCase(district.name);
      const cityName = toTitleCase(province.name);
      const duplicateName = (nameCounts.get(districtName) ?? 0) > 1;
      const genericCenter = districtName === 'Merkez';

      return {
        district: districtName,
        city: cityName,
        level: getDifficulty(district.population ?? 0),
        population: district.population ?? null,
        districtCode: district.id,
        region: province.region?.tr ?? null,
        ambiguous: duplicateName || genericCenter
      };
    })
    .sort((first, second) => {
      const cityOrder = first.city.localeCompare(second.city, turkishLocale);

      if (cityOrder !== 0) {
        return cityOrder;
      }

      return first.district.localeCompare(second.district, turkishLocale);
    });

  if (districts.length !== 973) {
    throw new Error(`973 ilçe bekleniyordu, ${districts.length} kayıt bulundu.`);
  }

  const usableCount = districts.filter((district) => !district.ambiguous).length;
  const ambiguousCount = districts.length - usableCount;

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, serializeDataset(districts), 'utf8');

  console.log(`${districts.length} ilçe kaydı oluşturuldu.`);
  console.log(`${usableCount} kayıt tek cevaplı oyunda doğrudan kullanılabilir.`);
  console.log(`${ambiguousCount} kayıt aynı adlı veya Merkez ilçesi olduğu için işaretlendi.`);
  console.log(`Çıktı: ${OUTPUT_PATH}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
