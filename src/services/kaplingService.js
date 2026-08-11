import supabase from "../lib/supabase";

// ======================================================
// AMBIL KAPLING BERDASARKAN GUDEP
// ======================================================

export async function getKaplingByGudep(gudep_id) {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select(`
      *,
      profil_gudep(
        nama_pangkalan
      )
    `)
    .eq("gudep_id", gudep_id)
    .maybeSingle();

  if (error) {

    console.error(
      "GET KAPLING ERROR:",
      error
    );

    throw error;

  }

  return data;

}


// ======================================================
// AMBIL SEMUA DATA BLOK
// ======================================================

export async function getBlok() {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select(`
      *,
      profil_gudep(
        nama_pangkalan
      )
    `)
    .order("id");

  if (error) {

    console.error(
      "GET BLOK ERROR:",
      error
    );

    throw error;

  }

  return data || [];

}


// ======================================================
// SIMPAN PENEMPATAN BLOK
// ======================================================

export async function savePenempatanBlok(data) {

  const { data: hasil, error } = await supabase
    .from("penempatan_blok")
    .insert([data])
    .select()
    .single();

  if (error) {

    console.error(
      "SAVE BLOK ERROR:",
      error
    );

    throw error;

  }

  return hasil;

}


// ======================================================
// SIMPAN PETA
// ======================================================

export async function savePeta(data) {

  const { data: hasil, error } = await supabase
    .from("penempatan_blok")
    .insert(data)
    .select()
    .single();

  if (error) {

    console.error(
      "SAVE PETA ERROR:",
      error
    );

    throw error;

  }

  return hasil;

}


// ======================================================
// CEK APAKAH GUDEP SUDAH PUNYA KAPLING
// ======================================================

export async function cekKaplingGudep(gudepId) {

  const { data, error } = await supabase
    .from("penempatan_blok")
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
// AMBIL NOMOR KAPLING YANG SUDAH DIPAKAI
// BERDASARKAN KELURAHAN DAN JENIS
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
    .from("penempatan_blok")
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


  return (data || [])
    .map(
      item =>
        Number(
          item[kolomKapling]
        )
    )
    .filter(
      nomor =>
        !isNaN(nomor) &&
        nomor >= 1 &&
        nomor <= 15
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


  const kolomKelurahan =
    jenis === "putra"
      ? "kelurahan_putra"
      : "kelurahan_putri";

  const kolomKapling =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";


  const { data, error } = await supabase
    .from("penempatan_blok")
    .select("id")
    .eq(
      kolomKelurahan,
      kelurahan
    )
    .eq(
      kolomKapling,
      String(nomor).padStart(2, "0")
    )
    .maybeSingle();


  if (error) {

    console.error(
      "CEK NOMOR KAPLING ERROR:",
      error
    );

    throw error;

  }


  return Boolean(data);

}


// ======================================================
// NOMOR KAPLING PUTRA TERAKHIR
// ======================================================

export async function getNomorPutraTerakhir() {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select("kapling_putra")
    .not(
      "kapling_putra",
      "is",
      null
    );

  if (error) {
    throw error;
  }


  if (
    !data ||
    data.length === 0
  ) {

    return 0;

  }


  const nomor =
    data
      .map(
        x =>
          Number(
            x.kapling_putra
          )
      )
      .filter(
        n =>
          !isNaN(n)
      );


  return nomor.length
    ? Math.max(...nomor)
    : 0;

}


// ======================================================
// NOMOR KAPLING PUTRI TERAKHIR
// ======================================================

export async function getNomorPutriTerakhir() {

  const { data, error } = await supabase
    .from("penempatan_blok")
    .select("kapling_putri")
    .not(
      "kapling_putri",
      "is",
      null
    );

  if (error) {
    throw error;
  }


  if (
    !data ||
    data.length === 0
  ) {

    return 0;

  }


  const nomor =
    data
      .map(
        x =>
          Number(
            x.kapling_putri
          )
      )
      .filter(
        n =>
          !isNaN(n)
      );


  return nomor.length
    ? Math.max(...nomor)
    : 0;

}


// ======================================================
// NOMOR KAPLING BERIKUTNYA
// FUNGSI LAMA — DIPERTAHANKAN AGAR KOMPONEN LAIN
// TIDAK ERROR
// ======================================================

export async function getNomorKaplingBerikutnya(
  jenis
) {

  const kolom =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";


  const { data, error } = await supabase
    .from("penempatan_blok")
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


  const nomorTerpakai =
    (data || [])
      .map(
        item =>
          Number(
            item[kolom]
          )
      )
      .filter(
        nomor =>
          !isNaN(nomor)
      );


  let nomor = 1;


  while (
    nomorTerpakai.includes(nomor)
  ) {

    nomor++;

  }


  return nomor;

}