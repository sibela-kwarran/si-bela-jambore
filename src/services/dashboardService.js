import supabase from "../lib/supabase";


export async function getDashboardData(gudep_id){


  const { data:pembina, error:pembinaError } =
  await supabase
  .from("data_pembina")
  .select("*")
  .eq("gudep_id", gudep_id);



  if(pembinaError){
    console.error(
      "ERROR PEMBINA:",
      pembinaError
    );
  }




  const { data:peserta, error:pesertaError } =
  await supabase
  .from("peserta")
  .select("*")
  .eq("gudep_id", gudep_id);



  if(pesertaError){
    console.error(
      "ERROR PESERTA:",
      pesertaError
    );
  }





  const { data:gudep, error:gudepError } =
  await supabase
  .from("profil_gudep")
  .select("*")
  .eq("id", gudep_id);



  if(gudepError){
    console.error(
      "ERROR GUDEP:",
      gudepError
    );
  }





  const { data:kapling, error:kaplingError } =
  await supabase
  .from("penempatan_blok")
  .select("*")
  .eq("gudep_id", gudep_id);



  if(kaplingError){
    console.error(
      "ERROR KAPLING:",
      kaplingError
    );
  }



console.log(
"DASHBOARD GUDEP:",
{
 gudep_id,
 pembina,
 peserta,
 gudep,
 kapling
}
);



return {


peserta:
peserta?.length || 0,


pembina:
pembina?.length || 0,


gudep:
gudep?.length || 0,


kapling:
kapling?.length || 0


};


}