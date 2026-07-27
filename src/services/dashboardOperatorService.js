import supabase from "../lib/supabase";


export async function getDashboardOperator(gudep_id){


const {data:gudep}=await supabase
.from("profil_gudep")
.select("*")
.eq("id",gudep_id)
.single();



const {data:peserta}=await supabase
.from("peserta")
.select("*")
.eq("gudep_id",gudep_id);



const {data:pembina}=await supabase
.from("data_pembina")
.select("*")
.eq("gudep_id",gudep_id);



const {data:regu}=await supabase
.from("data_regu")
.select("*")
.eq("gudep_id",gudep_id);



const {data:pembayaran}=await supabase
.from("pembayaran")
.select("*")
.eq("gudep_id",gudep_id)
.single();



const {data:kapling}=await supabase
.from("penempatan_blok")
.select("*")
.eq("gudep_id",gudep_id)
.single();



return {


gudep,


peserta:{
putra:
peserta?.filter(
x=>x.jk==="Putra"
).length || 0,


putri:
peserta?.filter(
x=>x.jk==="Putri"
).length || 0
},


pembina:{
putra:
pembina?.filter(
x=>x.jk==="Putra"
).length || 0,


putri:
pembina?.filter(
x=>x.jk==="Putri"
).length || 0
},


regu:
regu?.length || 0,


pembayaran,


kapling


};


}