import supabase from "../lib/supabase";

const TABLE = "pembayaran";

// ======================================================
// OPERATOR LOGIN
// ======================================================

function getOperatorLogin() {
  const operator = JSON.parse(
    localStorage.getItem("operatorLogin")
  );

  if (!operator) {
    throw new Error("Operator belum login.");
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
// PEMBAYARAN ADMIN
// ======================================================

export async function getPembayaranAdmin() {

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      profil_gudep(
        id,
        nama_pangkalan,
        nama_mabigus
      )
    `)
    .order("id");

  if (error) throw error;

  return data || [];
}

// ======================================================
// PEMBAYARAN OPERATOR
// ======================================================

export async function getPembayaran() {

  const gudep = await getGudepLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep.id)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// ======================================================
// SIMPAN PEMBAYARAN
// ======================================================

export async function savePembayaran(dataBaru) {

  const gudep = await getGudepLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        ...dataBaru,
        gudep_id: gudep.id,
      },
    ])
    .select()
    .single();

  if (error) throw error;

  return data;
}

// ======================================================
// UPDATE PEMBAYARAN
// ======================================================

export async function updatePembayaran(
  id,
  dataBaru
) {

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
// SEMUA PEMBAYARAN ADMIN
// ======================================================

export async function getSemuaPembayaran() {

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      profil_gudep(
        id,
        nama_pangkalan,
        nama_mabigus
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data || [];
}

// ======================================================
// PEMBAYARAN LUNAS
// ======================================================

export async function getPembayaranLunas() {

  const { data, error } = await supabase
    .from(TABLE)
    .select(`
      *,
      profil_gudep(
        id,
        nama_pangkalan,
        nama_mabigus
      )
    `)
    .eq("status", "Lunas");

  if (error) throw error;

  return data || [];
}