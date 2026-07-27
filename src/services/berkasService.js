import supabase from "../lib/supabase";

const TABLE="berkas";


function getOperatorLogin(){

 const operator =
 JSON.parse(localStorage.getItem("operatorLogin"));

 if(!operator){
  throw new Error("Operator belum login");
 }

 return operator;

}


async function getGudepLogin(){

 const operator=getOperatorLogin();


 const {data,error}=await supabase
 .from("profil_gudep")
 .select("id")
 .eq("operator_id",operator.id)
 .single();


 if(error) throw error;


 return data;

}



// ambil berkas gudep sendiri

export async function getBerkas() {

  const operator = JSON.parse(
    localStorage.getItem("operatorLogin")
  );


  const { data: profil, error: profilError } = await supabase
    .from("profil_gudep")
    .select("id")
    .eq("operator_id", operator.id)
    .single();


  if (profilError) throw profilError;


  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .eq("gudep_id", profil.id)
    .order("id", { ascending:false })
.limit(1);


  if (error) throw error;


  return data || [];

}



// simpan

export async function saveBerkas(dataBaru){

 const {data,error}=await supabase
 .from(TABLE)
 .insert(dataBaru)
 .select()
 .single();


 if(error) throw error;


 return data;

}



// update

export async function updateBerkas(id,dataBaru){

 const {error}=await supabase
 .from(TABLE)
 .update(dataBaru)
 .eq("id",id);


 if(error) throw error;

}



// upload storage

export async function uploadFile(file,folder){


const namaFile =
`${folder}/${Date.now()}_${file.name}`;


const {error}=await supabase.storage
.from("berkas-jambore")
.upload(
 namaFile,
 file
);


if(error) throw error;



const {data}=supabase.storage
.from("berkas-jambore")
.getPublicUrl(namaFile);



return data.publicUrl;


}
export async function deleteBerkas(id) {

  const { error } = await supabase
    .from(TABLE)
    .delete()
    .eq("id", id);

  if(error) throw error;

}
export async function deleteFile(url){

  const path = url.split(
    "/berkas-jambore/"
  )[1];


  const {error}=await supabase.storage
  .from("berkas-jambore")
  .remove([
    path
  ]);


  if(error) throw error;

}
// ambil semua berkas untuk admin

export async function getSemuaBerkasAdmin(){

const {data,error}=await supabase
.from(TABLE)
.select(`
 *,
 profil_gudep(
   nama_pangkalan,
   nama_mabigus
 )
`)
.order("id",{ascending:false});


if(error) throw error;


return data || [];

}