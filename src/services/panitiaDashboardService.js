import supabase from "../lib/supabase";


export async function getPanitiaDashboard(){


const {data:peserta, error:pesertaError}=await supabase
.from("peserta")
.select("*");


if(pesertaError) throw pesertaError;



const {data:gudep, error:gudepError}=await supabase
.from("profil_gudep")
.select("*");


if(gudepError) throw gudepError;



const {data:pembina, error:pembinaError}=await supabase
.from("data_pembina")
.select("*");


if(pembinaError) throw pembinaError;



const {data:kapling, error:kaplingError}=await supabase
.from("penempatan_blok")
.select("*");


if(kaplingError) throw kaplingError;



return {

peserta: peserta?.length || 0,

gudep: gudep?.length || 0,

pembina: pembina?.length || 0,

kapling: kapling?.length || 0

};


}