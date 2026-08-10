import supabase from "../lib/supabase";

const TABLE = "berkas";
const BUCKET = "berkas-jambore";

// ======================================================
// KONFIGURASI UPLOAD
// ======================================================

export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

// ======================================================
// OPERATOR LOGIN
// ======================================================

function getOperatorLogin() {
  const operator = JSON.parse(
    localStorage.getItem("operatorLogin")
  );

  if (!operator) {
    throw new Error("Operator belum login");
  }

  return operator;
}

// ======================================================
// AMBIL GUDEP LOGIN
// ======================================================

async function getGudepLogin() {
  const operator = getOperatorLogin();

  const { data, error } = await supabase
    .from("profil_gudep")
    .select("id")
    .eq("operator_id", operator.id)
    .single();

  if (error) throw error;

  return data;
}

// ======================================================
// AMBIL BERKAS GUDEP SENDIRI
// ======================================================

export async function getBerkas() {
  const operator = getOperatorLogin();

  const { data: profil, error: profilError } =
    await supabase
      .from("profil_gudep")
      .select("id")
      .eq("operator_id", operator.id)
      .single();

  if (profilError) throw profilError;

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", profil.id)
    .order("id", {
      ascending: false,
    })
    .limit(1);

  if (error) throw error;

  return data || [];
}

// ======================================================
// AMBIL BERKAS BERDASARKAN GUDEP - ADMIN
// ======================================================

export async function getBerkasByGudep(gudepId) {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudepId)
    .order("id", {
      ascending: false,
    })
    .limit(1);

  if (error) {
    console.error(
      "GET BERKAS BY GUDEP ERROR:",
      error
    );

    throw error;
  }

  return data && data.length > 0
    ? data[0]
    : null;
}

// ======================================================
// SIMPAN BERKAS
// ======================================================

export async function saveBerkas(dataBaru) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(dataBaru)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ======================================================
// UPDATE BERKAS
// ======================================================

export async function updateBerkas(id, dataBaru) {
  const { data, error } = await supabase
    .from(TABLE)
    .update(dataBaru)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ======================================================
// UPLOAD FILE STORAGE
// ======================================================

export async function uploadFile(file, folder) {

  if (!file) {
    throw new Error("File tidak ditemukan");
  }

  // ----------------------------------------------------
  // CEK TIPE FILE
  // ----------------------------------------------------

  if (file.type !== "application/pdf") {
    throw new Error(
      "Berkas harus dalam format PDF"
    );
  }

  // ----------------------------------------------------
  // CEK UKURAN FILE
  // ----------------------------------------------------

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "Ukuran file terlalu besar. Maksimal 5 MB."
    );
  }

  // ----------------------------------------------------
  // NAMA FILE AMAN
  // ----------------------------------------------------

  const namaAsli = file.name
    .replace(/\.pdf$/i, "")
    .replace(/[^a-zA-Z0-9-_]/g, "_")
    .substring(0, 100);

  const namaFile =
    `${folder}/${Date.now()}_${namaAsli}.pdf`;

  console.log(
    "UPLOAD FILE:",
    namaFile
  );

  // ----------------------------------------------------
  // UPLOAD KE SUPABASE STORAGE
  // ----------------------------------------------------

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(
      namaFile,
      file,
      {
        cacheControl: "3600",
        upsert: false,
        contentType: "application/pdf",
      }
    );

  if (error) {
    console.error(
      "SUPABASE STORAGE UPLOAD ERROR:",
      error
    );

    throw error;
  }

  // ----------------------------------------------------
  // PUBLIC URL
  // ----------------------------------------------------

  const { data } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(namaFile);

  if (!data?.publicUrl) {
    throw new Error(
      "URL file tidak berhasil dibuat"
    );
  }

  return data.publicUrl;
}

// ======================================================
// HAPUS DATA BERKAS DARI DATABASE
// ======================================================

export async function deleteBerkas(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;
}

// ======================================================
// HAPUS FILE DARI STORAGE
// ======================================================

export async function deleteFile(url) {

  if (!url) return;

  try {

    const marker = `/${BUCKET}/`;

    const posisi = url.indexOf(marker);

    if (posisi === -1) {
      console.warn(
        "PATH STORAGE TIDAK DITEMUKAN:",
        url
      );

      return;
    }

    const path = decodeURIComponent(
      url.substring(
        posisi + marker.length
      )
    );

    if (!path) return;

    console.log(
      "HAPUS FILE STORAGE:",
      path
    );

    const { error } = await supabase.storage
      .from(BUCKET)
      .remove([path]);

    if (error) {
      console.error(
        "DELETE STORAGE ERROR:",
        error
      );

      throw error;
    }

  } catch (error) {

    console.error(
      "GAGAL MENGHAPUS FILE STORAGE:",
      error
    );

    throw error;
  }
}

// ======================================================
// AMBIL SEMUA BERKAS UNTUK ADMIN
// ======================================================

export async function getSemuaBerkasAdmin() {

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      profil_gudep(
        nama_pangkalan,
        nama_mabigus
      )
    `)
    .order("id", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}