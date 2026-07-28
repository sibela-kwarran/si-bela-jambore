import { useEffect, useState } from "react";

import supabase from "../../lib/supabase";
import GrafikGudep from "./GrafikGudep";
import TabelGudepTerbaru from "./TabelGudepTerbaru";
import AktivitasHariIni from "./AktivitasHariIni";
import RingkasanPembayaran from "./RingkasanPembayaran";
import StatusBerkas from "./StatusBerkas";
import AgendaJamran from "./AgendaJamran";





import {
  FaCampground,
  FaUsers,
  FaUserTie,
  FaCheckCircle,
  FaClock,
  FaMoneyBillWave,
} from "react-icons/fa";





import {
 getAdminDashboard
} from "../../services/adminDashboardService";

export default function DashboardAdmin() {

  const [dashboard,setDashboard] = useState({

  gudep:0,
  peserta:0,
  pembina:0,
  regu:0,
  pembayaran:0,
  verifikasi:0,
  menunggu:0

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

<div className="
grid
grid-cols-1
sm:grid-cols-2
xl:grid-cols-4
gap-6
">


<div className="
bg-blue-600
text-white
rounded-2xl
shadow-lg
p-6
hover:scale-105
transition
">


{/* GUDEP */}
<div className="flex justify-between items-center">

<div>

<p className="text-lg">
🏕 Gudep
</p>

<h2 className="text-4xl font-bold mt-3">
{dashboard.gudep}
</h2>

<p className="mt-2 opacity-80">
Total Gugus Depan
</p>

</div>

<FaCampground size={45}/>

</div>

</div>




{/* PESERTA */}

<div className="
bg-green-600
text-white
rounded-2xl
shadow-lg
p-6
hover:scale-105
transition
">

<div className="flex justify-between items-center">

<div>

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

<FaUsers size={45}/>

</div>

</div>





{/* VERIFIKASI */}

<div className="
bg-purple-600
text-white
rounded-2xl
shadow-lg
p-6
hover:scale-105
transition
">

<div className="flex justify-between">

<div>

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


<FaCheckCircle size={45}/>


</div>

</div>

{/* MENUNGGU */}

<div className="
bg-orange-500
text-white
rounded-2xl
shadow-lg
p-6
hover:scale-105
transition
">

<div className="flex justify-between">


<div>

<p className="text-lg">
⏳ Menunggu
</p>


<h2 className="text-4xl font-bold mt-3">
{dashboard.menunggu}
</h2>


<p className="mt-2 opacity-80">
Belum Diverifikasi
</p>


</div>


<FaClock size={45}/>


</div>

</div>

<GrafikGudep
    totalGudep={dashboard.gudep}
    sudahVerifikasi={dashboard.verifikasi}
    belumVerifikasi={dashboard.menunggu}
/>
 </div>
{/* TABEL */}
<div className="mt-8 w-full">

  <TabelGudepTerbaru />
 </div>
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">

    <AktivitasHariIni />

    <RingkasanPembayaran />

    <StatusBerkas />

    <AgendaJamran />

  </div>

</div>
);

}