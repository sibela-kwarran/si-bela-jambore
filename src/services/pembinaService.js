import supabase from "../lib/supabase";

const TABLE = "data_pembina";
function getOperatorLogin() {
  const operator = JSON.parse(localStorage.getItem("operatorLogin"));

  if (!operator) {
    throw new Error("Operator belum login.");
  }

  return operator;
}

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
// Ambil semua pembina
export async function getPembina() {

  const gudep = await getGudepLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep.id)
    .order("id");

  if (error) throw error;

  return data;
}

// Simpan pembina
export async function savePembina(dataBaru) {

  const gudep = await getGudepLogin();

  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        ...dataBaru,
        gudep_id: gudep.id,
      },
    ])
    .select();

  if (error) throw error;

  return data;
}

  

// Hapus
export async function deletePembina(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

}

// Update
export async function updatePembina(id, dataBaru) {

  const { error } = await supabase
    .from(TABLE)
    .update(dataBaru)
    .eq("id", id);

  if (error) throw error;

}
// Ambil pembina berdasarkan gudep untuk admin
export async function getPembinaByGudep(gudep_id){

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep_id)
    .order("id");


  if(error){

    console.error(
      "ERROR GET PEMBINA BY GUDEP:",
      error
    );

    throw error;

  }


  return data;

}