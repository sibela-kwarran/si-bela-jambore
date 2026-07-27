import supabase from "../lib/supabase";

const TABLE = "pembayaran";

function getOperatorLogin() {

  const operator = JSON.parse(
    localStorage.getItem("operatorLogin")
  );

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

export async function getPembayaranAdmin(){

const {data,error}=await supabase
.from("pembayaran")
.select(`
*,
profil_gudep(
 nama_pangkalan,
 nama_mabigus
)
`)
.order("id");


if(error) throw error;


return data;

}

export async function getPembayaran(){

  const gudep = await getGudepLogin();


  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", gudep.id)
    .maybeSingle();


  if(error) throw error;


  return data;

}

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



export async function updatePembayaran(id,dataBaru){

  const { error } = await supabase
    .from("pembayaran")
    .update(dataBaru)
    .eq("id",id);


  if(error) throw error;

}
export async function getSemuaPembayaran() {

  const { data, error } = await supabase
    .from("pembayaran")
    .select(`
    *,
    profil_gudep (
      id,
      nama_pangkalan,
      nama_mabigus
    )
  `)
    .order("created_at", {
      ascending: false,
    });

  if (error) throw error;

  return data;
}
export async function getPembayaranLunas(){

  const {data,error}=await supabase
  .from("pembayaran")
  .select(`
    *,
    profil_gudep(
      id,
      nama_pangkalan,
      nama_mabigus
    )
  `)
  .eq(
    "status",
    "Lunas"
  );


  if(error) throw error;


  return data || [];

}