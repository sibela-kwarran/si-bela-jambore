import { useEffect, useState } from "react";

import supabase from "../../lib/supabase";

import {
 getAdminDashboard
} from "../../services/adminDashboardService";

export default function DashboardAdmin() {
const [dashboard,setDashboard] = useState({

gudep:0,
peserta:0,
pembayaran:0,
kapling:0,
verifikasi:0

});

const [statistik,setStatistik] = useState({

    totalGudep:0,

    totalPeserta:0,

    sudahVerifikasi:0,

    belumVerifikasi:0

});


useEffect(()=>{

async function load(){

const hasil =
await getAdminDashboard();

console.log(
"ADMIN DASHBOARD:",
hasil
);


setDashboard(hasil);

}


load();


},[]);


async function loadDashboard(){


try{


// TOTAL GUDEP

const {data:gudep}=await supabase
.from("profil_gudep")
.select("*");

console.log(
"DATA GUDEP:",
gudep
);

// TOTAL PESERTA

const {data:peserta}=await supabase
.from("peserta")
.select("*");



// DATA PENDAFTARAN

const {data:pendaftaran}=await supabase
.from("pendaftaran")
.select("*");



const totalGudep =
gudep?.length || 0;



const totalPeserta =
peserta?.length || 0;



const sudahVerifikasi =
pendaftaran?.filter(
item=>item.status==="Terverifikasi"
).length || 0;



setStatistik({

totalGudep,

totalPeserta,

sudahVerifikasi,

belumVerifikasi:
totalGudep - sudahVerifikasi

});



}catch(error){

console.error(
"DASHBOARD ADMIN ERROR:",
error
);


}


}



return (
  

    <div className="space-y-8">

  {/* HEADER */}

  <div>

    <h1 className="text-4xl font-bold text-amber-700">
      Dashboard Admin
    </h1>

    <p className="text-gray-600 mt-2">
      Selamat datang di Panel Admin SI BELA
    </p>

  </div>

  {/* KARTU STATISTIK */}

  <div className="grid grid-cols-4 gap-6">

    <div className="bg-blue-500 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        🏕 Gudep
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {dashboard.gudep}
      </h2>

      <p className="mt-2 opacity-80">
        Total Gudep
      </p>

    </div>

    <div className="bg-green-600 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        👥 Peserta
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {dashboard.peserta}
      </h2>

      <p className="mt-2 opacity-80">
        Total Peserta
      </p>

    </div>

    <div className="bg-purple-600 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        ✅ Verifikasi
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {dashboard.verifikasi}
      </h2>

      <p className="mt-2 opacity-80">
        Sudah Diverifikasi
      </p>

    </div>

    <div className="bg-orange-500 text-white rounded-2xl shadow-lg p-6">

      <p className="text-lg">
        ⏳ Menunggu
      </p>

      <h2 className="text-4xl font-bold mt-3">
        {dashboard.kapling}
      </h2>

      <p className="mt-2 opacity-80">
        Belum Diverifikasi
      </p>

    </div>

  </div>

</div>

  );

}