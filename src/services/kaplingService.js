import supabase from "../lib/supabase";


// ambil kapling berdasarkan gudep
export async function getKaplingByGudep(gudep_id){

const {data,error}=await supabase
.from("penempatan_blok")
.select(`
 *,
 profil_gudep(
   nama_pangkalan
 )
`)
.eq("gudep_id",gudep_id)
.single();


if(error){

console.error(
"GET KAPLING ERROR:",
error
);

throw error;

}


return data;

}
export async function getBlok(){

const {data,error}=await supabase
.from("penempatan_blok")
.select(`
 *,
 profil_gudep(
   nama_pangkalan
 )
`)
.order("id");


if(error){

console.error(
"GET BLOK ERROR:",
error
);

throw error;

}


return data || [];

}
export async function savePenempatanBlok(data){

const {data:hasil,error}=await supabase
.from("penempatan_blok")
.insert([data])
.select()
.single();


if(error){

console.error(
"SAVE BLOK ERROR:",
error
);

throw error;

}


return hasil;

}
export async function savePeta(data){

  const { data:hasil, error } = await supabase
    .from("penempatan_blok")
    .insert(data)
    .select()
    .single();


  if(error){

    console.error(
      "SAVE PETA ERROR:",
      error
    );

    throw error;

  }


  return hasil;

}