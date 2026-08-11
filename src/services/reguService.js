import supabase from "../lib/supabase";

const TABLE = "data_regu";


// ==========================
// AMBIL DATA REGU OPERATOR
// ==========================
export async function getRegu(){

  const operator = JSON.parse(
    localStorage.getItem("operatorLogin")
  );


  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", operator.gudep_id)
    .order("id");


  if(error) throw error;


  return data;

}



// ==========================
// AMBIL DATA REGU ADMIN
// ==========================
export async function getReguByGudep(gudep_id){


  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep_id)
    .order("id");


  if(error) throw error;


  return data;

}



// ==========================
// SIMPAN REGU
// ==========================
export async function saveRegu(dataBaru){


  const operator = JSON.parse(
    localStorage.getItem("operatorLogin")
  );


  const { data, error } = await supabase
    .from(TABLE)
    .insert([
      {
        ...dataBaru,
        gudep_id: operator.gudep_id,
      }
    ])
    .select();


  if(error) throw error;


  return data;

}



// ==========================
// UPDATE REGU
// ==========================
export async function updateRegu(id, dataBaru){


  const { data, error } = await supabase
    .from(TABLE)
    .update(dataBaru)
    .eq("id", id)
    .select();


  if(error) throw error;


  return data;

}



// ==========================
// HAPUS REGU
// ==========================
export async function deleteRegu(id){


  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);


  if(error) throw error;

}
// ===================================
// CEK REGU PUTRA & PUTRI
// ===================================
// ===================================
// CEK JUMLAH REGU PUTRA & PUTRI
// ===================================
export async function getJenisRegu(gudepId) {
  const { data, error } = await supabase
    .from("data_regu")
    .select("jenis, gudep_id")
    .eq("gudep_id", gudepId);

  if (error) throw error;

  const reguPutra = (data || []).filter(
    x =>
      String(x.jenis || "")
        .trim()
        .toLowerCase() === "putra"
  );

  const reguPutri = (data || []).filter(
    x =>
      String(x.jenis || "")
        .trim()
        .toLowerCase() === "putri"
  );

  return {
    adaPutra: reguPutra.length > 0,
    adaPutri: reguPutri.length > 0,

    jumlahPutra: reguPutra.length,
    jumlahPutri: reguPutri.length,
  };
}