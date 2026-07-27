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