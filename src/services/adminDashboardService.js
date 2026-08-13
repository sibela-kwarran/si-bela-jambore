import supabase from "../lib/supabase";


export async function getAdminDashboard(){


try{


// ======================
// TOTAL GUDEP
// ======================

const { data:gudep, error:gudepError } =
await supabase
.from("profil_gudep")
.select("*");

if(gudepError)
throw gudepError;



// ======================
// TOTAL PESERTA
// ======================

const { count: jumlahPeserta, error: pesertaError } =
await supabase
  .from("peserta")
  .select("*", {
    count: "exact",
    head: true
  });

if (pesertaError)
  throw pesertaError;


// ======================
// PENDAFTARAN
// ======================

const { data: pendaftaran, error: pendaftaranError } =
await supabase
.from("pendaftaran")
.select("*");

if (pendaftaranError)
throw pendaftaranError;
// ======================
// PEMBAYARAN
// ======================


const pembayaran = [];







// ======================
// KAPLING
// ======================

const { data:kapling, error:kaplingError } =
await supabase
.from("penempatan_blok")
.select("*");


if(kaplingError)
throw kaplingError;




return {

  gudep:
  gudep?.length || 0,

  peserta:
jumlahPeserta || 0,

  pembayaran:
  pembayaran?.filter(
    item => item.status === "Lunas"
  ).length || 0,

  kapling:
  kapling?.length || 0,

  verifikasi:
  pendaftaran?.filter(
    item => item.status === "Terverifikasi"
  ).length || 0,

  menunggu:
  pendaftaran?.filter(
    item => item.status === "Menunggu"
  ).length || 0

};


}catch(error){

console.error(
"ADMIN DASHBOARD ERROR DETAIL:",
error
);

return {

gudep:0,
  peserta:0,
  pembayaran:0,
  kapling:0,
  verifikasi:0,
  menunggu:0

};

}
}