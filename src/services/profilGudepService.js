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
// AMBIL PROFIL GUDEP
// ======================================
export async function getProfilGudep() {

  const operator = getOperatorLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("operator_id", operator.id)
    .maybeSingle();

  if (error) throw error;

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

  const dataBaru = {

    operator_id: operator.id,

    nama_pangkalan: form.pangkalan,

    gudep_putra: form.gudepPutra,

    gudep_putri: form.gudepPutri,

    kwarran: form.kwarran,

    kwarcab: form.kwarcab,

    kabupaten: form.kabupaten,

    provinsi: form.provinsi,

    alamat: form.alamat,

    email: form.email,

    nama_mabigus: form.namaMabigus,

    hp_mabigus: form.hpMabigus,

  };

  console.log("DATA PROFIL:", dataBaru);

  // ==========================
  // CEK PROFIL SUDAH ADA?
  // ==========================
  const {
    data: profilLama,
    error: cekError,
  } = await supabase
    .from(TABLE)
    .select("id")
    .eq("operator_id", operator.id)
    .maybeSingle();

  if (cekError) throw cekError;

  // ==========================
  // UPDATE
  // ==========================
  if (profilLama) {

    const {
      data,
      error,
    } = await supabase
      .from(TABLE)
      .update(dataBaru)
      .eq("id", profilLama.id)
      .select()
      .single();

    if (error) throw error;

    await supabase
      .from("operator_gudep")
      .update({
        gudep_id: data.id,
      })
      .eq("id", operator.id);

    return data;
  }

  // ==========================
  // INSERT
  // ==========================
  const {
    data,
    error,
  } = await supabase
    .from(TABLE)
    .insert(dataBaru)
    .select()
    .single();

  if (error) throw error;

  await supabase
    .from("operator_gudep")
    .update({
      gudep_id: data.id,
    })
    .eq("id", operator.id);

  return data;
}

// ======================================
// UPDATE PROFIL
// ======================================
export async function updateProfilGudep(id, form) {

  const dataUpdate = {

    nama_pangkalan: form.pangkalan,

    gudep_putra: form.gudepPutra,

    gudep_putri: form.gudepPutri,

    kwarran: form.kwarran,

    kwarcab: form.kwarcab,

    kabupaten: form.kabupaten,

    provinsi: form.provinsi,

    alamat: form.alamat,

    email: form.email,

    nama_mabigus: form.namaMabigus,

    hp_mabigus: form.hpMabigus,

  };

  const { error } = await supabase
    .from(TABLE)
    .update(dataUpdate)
    .eq("id", id);

  if (error) throw error;
}

// ======================================
// ADMIN
// ======================================
export async function getProfilGudepById(id) {

  const { data, error } = await supabase
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