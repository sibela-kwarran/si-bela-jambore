import supabase from "../lib/supabase.js";

console.log("SERVICE PENDAFTARAN AKTIF");

// ===============================
// SIMPAN PENDAFTARAN
// ===============================
export async function savePendaftaran(data) {

  console.log("INSERT DATA:", data);

  const { data: hasil, error } = await supabase
    .from("pendaftaran")
    .insert(data)
    .select()
    .single();

  if (error) {
    console.error(error);
    throw error;
  }

  return hasil;
}

// ===============================
// PENDAFTARAN BERDASARKAN GUDEP
// ===============================
export async function getPendaftaranByGudep(gudepId) {

  const { data, error } = await supabase
    .from("pendaftaran")
    .select("*")
    .eq("gudep_id", gudepId)
    .order("id", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    throw error;
  }

  return data.length > 0 ? data[0] : null;
}

// ===============================
// SEMUA PENDAFTARAN (ADMIN)
// ===============================
export async function getSemuaPendaftaran() {

  const { data, error } = await supabase
    .from("pendaftaran")
    .select(`
      *,
      profil_gudep(
        nama_pangkalan,
        nama_mabigus
      )
    `)
    .order("tanggal_kirim", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    throw error;
  }

  return data;
}

// ===============================
// UPDATE STATUS PENDAFTARAN
// ===============================
export async function updatePendaftaran(id, data){

  const { data: hasil, error } = await supabase
    .from("pendaftaran")
    .update(data)
    .eq("id", id)
    .select();

  if(error){
    console.error("UPDATE PENDAFTARAN ERROR:", error);
    throw error;
  }

  return hasil;

}
export async function getPendaftaranById(id){

const {data,error}=await supabase
.from("pendaftaran")
.select("*")
.eq("id",id)
.single();


if(error){

console.error(
"GET PENDAFTARAN ERROR:",
error
);

throw error;

}

return data;

}