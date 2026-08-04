import supabase from "../lib/supabase";


export async function getLaporanAdmin(){

try {


const {data:gudep,error:gudepError}
=
await supabase
.from("profil_gudep")
.select(`
id,
nama_pangkalan
`);


if(gudepError) throw gudepError;



const laporan = await Promise.all(

gudep.map(async(item)=>{


// PEMBINA

const {data:pembina}
=
await supabase
.from("data_pembina")
.select("jk")
.eq("gudep_id",item.id);



const pembinaPutra =
pembina?.filter(
x=>x.jk==="Putra"
).length || 0;



const pembinaPutri =
pembina?.filter(
x=>x.jk==="Putri"
).length || 0;




// PESERTA

const {data:peserta}
=
await supabase
.from("peserta")
.select("jk")
.eq("gudep_id",item.id);



const pesertaPutra =
peserta?.filter(
x=>x.jk==="Putra"
).length || 0;



const pesertaPutri =
peserta?.filter(
x=>x.jk==="Putri"
).length || 0;





// REGU

const {count:jumlahRegu}
=
await supabase
.from("data_regu")
.select("*",{count:"exact",head:true})
.eq("gudep_id",item.id);





return {

  id: item.id,

  nama_gudep: item.nama_pangkalan,

  pembinaPutra,

  pembinaPutri,

  pesertaPutra,

  pesertaPutri,

  jumlahRegu: jumlahRegu || 0

};


})

);



return laporan;



}catch(error){

console.error(
"LAPORAN ERROR:",
error
);

throw error;


}


}