import supabase from "../lib/supabase";

const TABLE = "peserta";

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

export async function getPeserta() {

  console.log("=== MULAI GET PESERTA ===");

  const operator = getOperatorLogin();

  console.log("OPERATOR LOGIN:", operator);

  const gudep = await getGudepLogin();

  console.log("GUDEP LOGIN:", gudep);

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep.id)
    .order("id");

  console.log("HASIL GET PESERTA:", data);
  console.log("ERROR GET PESERTA:", error);

  if (error) throw error;

  return data || [];
}

export async function savePeserta(dataBaru) {

  const gudep = await getGudepLogin();


  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        ...dataBaru,
        gudep_id: gudep.id,
      }
    ])
    .select();


  console.log("DATA PESERTA DIKIRIM:", {
    ...dataBaru,
    gudep_id: gudep.id,
  });

  console.log("HASIL INSERT PESERTA:", data);
  console.log("ERROR INSERT PESERTA:", error);


  if (error) throw error;


  return data;

}
export async function updatePeserta(id, dataBaru) {

  const { error } = await supabase
    .from(TABLE)
    .update(dataBaru)
    .eq("id", id);

  if (error) throw error;

}


export async function deletePeserta(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if (error) throw error;

}
// Ambil peserta berdasarkan gudep untuk admin

export async function getPesertaByGudep(gudep_id){

  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep_id)
    .order("id");


  if(error){

    console.error(
      "ERROR GET PESERTA BY GUDEP:",
      error
    );

    throw error;

  }


  return data;

}