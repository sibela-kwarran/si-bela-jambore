
import supabase from "../lib/supabase";

const TABLE = "penempatan_blok";

// ======================================================
// AMBIL KAPLING BERDASARKAN GUDEP
// ======================================================

export async function getKaplingByGudep(gudep_id) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep_id)
    .maybeSingle();

  if (error) {
    console.error("GET KAPLING ERROR:", error);
    throw error;
  }

  return data;
}


// ======================================================
// AMBIL SEMUA DATA BLOK
//
// PENTING:
// Tidak menggunakan nested profil_gudep.
// Ini mencegah error Failed to fetch akibat
// relationship Supabase.
// ======================================================

export async function getBlok() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("GET BLOK ERROR:", error);
    throw error;
  }

  return data || [];
}


// ======================================================
// SIMPAN PENEMPATAN BLOK
// ======================================================

export async function savePenempatanBlok(data) {
  if (!data || !data.gudep_id) {
    throw new Error(
      "Data penempatan tidak valid: gudep_id tidak tersedia."
    );
  }

  const { data: hasil, error } = await supabase
    .from(TABLE)
    .insert([data])
    .select("*")
    .single();

  if (error) {
    console.error(
      "SAVE PENEMPATAN BLOK ERROR:",
      error
    );

    throw error;
  }

  return hasil;
}


// ======================================================
// SIMPAN PETA
//
// Dipertahankan agar komponen lama tidak error.
// ======================================================

export async function savePeta(data) {
  if (!data) {
    throw new Error(
      "Data peta tidak tersedia."
    );
  }

  const { data: hasil, error } = await supabase
    .from(TABLE)
    .insert(
      Array.isArray(data)
        ? data
        : [data]
    )
    .select("*");

  if (error) {
    console.error(
      "SAVE PETA ERROR:",
      error
    );

    throw error;
  }

  return Array.isArray(data)
    ? hasil || []
    : hasil?.[0] || null;
}


// ======================================================
// CEK APAKAH GUDEP SUDAH PUNYA KAPLING
// ======================================================

export async function cekKaplingGudep(gudepId) {
  if (!gudepId) {
    return null;
  }

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudepId)
    .maybeSingle();

  if (error) {
    console.error(
      "CEK KAPLING GUDEP ERROR:",
      error
    );

    throw error;
  }

  return data;
}


// ======================================================
// NORMALISASI NOMOR KAPLING
//
// Bisa menerima:
// 003
// 003,004
// 003, 004
// PA003
// PA003,PA004
// ======================================================

function normalisasiNomor(value) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return [];
  }

  return String(value)
    .split(",")
    .map(item =>
      String(item)
        .trim()
        .replace(/^PA/i, "")
        .replace(/^PI/i, "")
        .replace(/^0+/, "") || "0"
    )
    .map(Number)
    .filter(
      nomor =>
        !isNaN(nomor) &&
        nomor >= 1 &&
        nomor <= 1000
    );
}


// ======================================================
// AMBIL NOMOR KAPLING YANG SUDAH DIPAKAI
//
// Berdasarkan kelurahan + jenis.
//
// Contoh hasil:
// [1, 2, 3, 4]
// ======================================================

export async function getKaplingTerpakai(
  kelurahan,
  jenis
) {
  if (!kelurahan || !jenis) {
    return [];
  }

  const kolomKelurahan =
    jenis === "putra"
      ? "kelurahan_putra"
      : "kelurahan_putri";

  const kolomKapling =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";

  const { data, error } = await supabase
    .from(TABLE)
    .select(
      `${kolomKelurahan}, ${kolomKapling}`
    )
    .eq(
      kolomKelurahan,
      kelurahan
    )
    .not(
      kolomKapling,
      "is",
      null
    );

  if (error) {
    console.error(
      "GAGAL CEK KAPLING TERPAKAI:",
      error
    );

    throw error;
  }

  const hasil = [];

  (data || []).forEach(item => {
    hasil.push(
      ...normalisasiNomor(
        item[kolomKapling]
      )
    );
  });

  return [
    ...new Set(hasil)
  ].sort(
    (a, b) => a - b
  );
}


// ======================================================
// CEK SATU NOMOR KAPLING
// ======================================================

export async function cekNomorKaplingDipakai(
  kelurahan,
  jenis,
  nomor
) {
  if (
    !kelurahan ||
    !jenis ||
    !nomor
  ) {
    return false;
  }

  const daftar =
    await getKaplingTerpakai(
      kelurahan,
      jenis
    );

  return daftar.includes(
    Number(nomor)
  );
}


// ======================================================
// NOMOR KAPLING PUTRA TERAKHIR
// ======================================================

export async function getNomorPutraTerakhir() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("kapling_putra")
    .not(
      "kapling_putra",
      "is",
      null
    );

  if (error) {
    console.error(
      "GET NOMOR PUTRA TERAKHIR ERROR:",
      error
    );

    throw error;
  }

  const semuaNomor = [];

  (data || []).forEach(item => {
    semuaNomor.push(
      ...normalisasiNomor(
        item.kapling_putra
      )
    );
  });

  return semuaNomor.length
    ? Math.max(...semuaNomor)
    : 0;
}


// ======================================================
// NOMOR KAPLING PUTRI TERAKHIR
// ======================================================

export async function getNomorPutriTerakhir() {
  const { data, error } = await supabase
    .from(TABLE)
    .select("kapling_putri")
    .not(
      "kapling_putri",
      "is",
      null
    );

  if (error) {
    console.error(
      "GET NOMOR PUTRI TERAKHIR ERROR:",
      error
    );

    throw error;
  }

  const semuaNomor = [];

  (data || []).forEach(item => {
    semuaNomor.push(
      ...normalisasiNomor(
        item.kapling_putri
      )
    );
  });

  return semuaNomor.length
    ? Math.max(...semuaNomor)
    : 0;
}


// ======================================================
// NOMOR KAPLING BERIKUTNYA
//
// Dipertahankan untuk kompatibilitas
// dengan komponen lama.
// ======================================================

export async function getNomorKaplingBerikutnya(
  jenis
) {
  const kolom =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";

  const { data, error } = await supabase
    .from(TABLE)
    .select(kolom)
    .not(
      kolom,
      "is",
      null
    );

  if (error) {
    console.error(
      "GAGAL CEK NOMOR KAPLING:",
      error
    );

    throw error;
  }

  const nomorTerpakai = [];

  (data || []).forEach(item => {
    nomorTerpakai.push(
      ...normalisasiNomor(
        item[kolom]
      )
    );
  });

  let nomor = 1;

  while (
    nomorTerpakai.includes(nomor)
  ) {
    nomor++;
  }

  return nomor;
}
