import supabase from "../lib/supabase";


export async function getPeta(){


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
"GET PETA ERROR:",
error
);

throw error;

}


return data || [];


}



export async function getDetailKapling(gudep_id){


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



if(error) throw error;


return data;


}
export async function savePeta(data){


const {data:hasil,error}=await supabase
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