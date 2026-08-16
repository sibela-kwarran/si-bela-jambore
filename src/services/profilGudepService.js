import supabase from "../lib/supabase";

const TABLE = "profil_gudep";

// ======================================
// AMBIL SESSION OPERATOR
// ======================================
function getOperatorLogin() {
  const data = localStorage.getItem("operatorLogin");

  console.log("CEK SESSION PROFIL GUDEP:", data);

  if (!data) {
    throw new Error("Operator belum login.");
  }

  return JSON.parse(data);
}


// ======================================
// NORMALISASI NAMA PANGKALAN
// ======================================
// Contoh:
// "SMPIT AQIDAH"
// "smpit aqidah"
// " SMPIT AQIDAH "
//
// dianggap sebagai nama yang sama.
// ======================================
function normalisasiNama(nama) {
  return String(nama || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}


// ======================================
// AMBIL PROFIL GUDEP OPERATOR
// ======================================
export async function getProfilGudep() {

  const operator = getOperatorLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("operator_id", operator.id)
    .maybeSingle();

  if (error) {

    console.error(
      "ERROR GET PROFIL GUDEP:",
      error
    );

    throw error;
  }


  // ======================================
  // SIMPAN gudep_id KE SESSION OPERATOR
  // ======================================

  if (data) {

    localStorage.setItem(
      "operatorLogin",
      JSON.stringify({
        ...operator,
        gudep_id: data.id,
      })
    );

  }

  return data;
}


// ======================================
// SIMPAN / UPDATE PROFIL
// ======================================
export async function saveProfilGudep(form) {

  const operator = getOperatorLogin();


  // ======================================
  // VALIDASI NAMA PANGKALAN
  // ======================================

  const namaPangkalan =
    String(form.pangkalan || "").trim();

  if (!namaPangkalan) {

    throw new Error(
      "Nama Pangkalan wajib diisi."
    );

  }


  // ======================================
  // CEK NAMA PANGKALAN SUDAH DIGUNAKAN
  // ======================================

  const namaNormal =
    normalisasiNama(namaPangkalan);


  const {
    data: semuaProfil,
    error: cekError
  } = await supabase
    .from(TABLE)
    .select(
      "id,operator_id,nama_pangkalan"
    );


  if (cekError) {

    console.error(
      "ERROR CEK DUPLIKAT GUDEP:",
      cekError
    );

    throw cekError;
  }


  // ======================================
  // CARI NAMA YANG SAMA
  // ======================================

  const duplikat =
    (semuaProfil || []).find(item => {

      const namaDatabase =
        normalisasiNama(
          item.nama_pangkalan
        );

      return (
        namaDatabase === namaNormal &&
        String(item.operator_id) !==
          String(operator.id)
      );

    });


  // ======================================
  // JIKA SUDAH ADA
  // ======================================

  if (duplikat) {

    throw new Error(
      `Nama Pangkalan "${namaPangkalan}" sudah terdaftar pada operator lain. Silakan gunakan data Gudep yang sudah ada dan jangan membuat profil baru.`
    );

  }


  // ======================================
  // DATA BARU
  // ======================================

  const dataBaru = {

    operator_id:
      operator.id,

    nama_pangkalan:
      namaPangkalan,

    gudep_putra:
      form.gudepPutra,

    gudep_putri:
      form.gudepPutri,

    kwarran:
      form.kwarran,

    kwarcab:
      form.kwarcab,

    kabupaten:
      form.kabupaten,

    provinsi:
      form.provinsi,

    alamat:
      form.alamat,

    email:
      form.email,

    nama_mabigus:
      form.namaMabigus,

    hp_mabigus:
      form.hpMabigus,

  };


  console.log(
    "DATA PROFIL GUDEP:",
    dataBaru
  );


  // ======================================
  // UPSERT PROFIL
  // ======================================

  const {
  data,
  error,
} = await supabase
  .from(TABLE)
  .upsert(dataBaru, {
    onConflict: "operator_id",
  })
  .select()
  .single();

if (error) {

  console.error(
    "ERROR SIMPAN PROFIL GUDEP:",
    error
  );

  // ======================================
  // CEK DUPLIKAT NAMA PANGKALAN
  // ======================================

  if (
    error.code === "23505" &&
    error.message?.includes(
      "profil_gudep_nama_pangkalan_unique"
    )
  ) {

    throw new Error(
      `Nama Pangkalan "${namaPangkalan}" sudah terdaftar. Silakan gunakan data Gudep yang sudah ada dan jangan membuat profil baru.`
    );

  }

  // ======================================
  // ERROR LAIN
  // ======================================

  throw error;
}


  // ======================================
  // UPDATE GUDEP ID OPERATOR
  // ======================================

  const {
    error: operatorError,
  } = await supabase
    .from("operator_gudep")
    .update({
      gudep_id: data.id,
    })
    .eq(
      "id",
      operator.id
    );


  if (operatorError) {

    console.error(
      "ERROR UPDATE GUDEP ID OPERATOR:",
      operatorError
    );

    throw operatorError;
  }


  // ======================================
  // UPDATE SESSION
  // ======================================

  localStorage.setItem(
    "operatorLogin",
    JSON.stringify({
      ...operator,
      gudep_id: data.id,
    })
  );


  return data;
}


// ======================================
// UPDATE PROFIL GUDEP
// ======================================
export async function updateProfilGudep(
  id,
  form
) {

  const namaPangkalan =
    String(form.pangkalan || "").trim();


  if (!namaPangkalan) {

    throw new Error(
      "Nama Pangkalan wajib diisi."
    );

  }


  // ======================================
  // CEK DUPLIKAT SAAT EDIT
  // ======================================

  const namaNormal =
    normalisasiNama(namaPangkalan);


  const {
    data: semuaProfil,
    error: cekError
  } = await supabase
    .from(TABLE)
    .select(
      "id,operator_id,nama_pangkalan"
    );


  if (cekError) {

    throw cekError;

  }


  const duplikat =
    (semuaProfil || []).find(item => {

      const namaDatabase =
        normalisasiNama(
          item.nama_pangkalan
        );

      return (
        namaDatabase === namaNormal &&
        String(item.id) !==
          String(id)
      );

    });


  if (duplikat) {

    throw new Error(
      `Nama Pangkalan "${namaPangkalan}" sudah digunakan oleh Gudep lain.`
    );

  }


  // ======================================
  // UPDATE
  // ======================================

  const dataUpdate = {

    nama_pangkalan:
      namaPangkalan,

    gudep_putra:
      form.gudepPutra,

    gudep_putri:
      form.gudepPutri,

    kwarran:
      form.kwarran,

    kwarcab:
      form.kwarcab,

    kabupaten:
      form.kabupaten,

    provinsi:
      form.provinsi,

    alamat:
      form.alamat,

    email:
      form.email,

    nama_mabigus:
      form.namaMabigus,

    hp_mabigus:
      form.hpMabigus,

  };


  const { error } =
    await supabase
      .from(TABLE)
      .update(dataUpdate)
      .eq("id", id);


  if (error) {

    console.error(
      "ERROR UPDATE PROFIL GUDEP:",
      error
    );

    throw error;
  }

}


// ======================================
// ADMIN
// ======================================
export async function getProfilGudepById(id) {

  const {
    data,
    error
  } = await supabase
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .single();


  if (error) {

    console.error(
      "ERROR GET PROFIL GUDEP BY ID:",
      error
    );

    throw error;
  }


  return data;
}