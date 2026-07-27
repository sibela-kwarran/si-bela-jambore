import { useEffect, useState } from "react";

import {
  FaUserGraduate,
  FaUserTie,
  FaCampground,
  FaMoneyBill,
  FaMapMarkerAlt,
} from "react-icons/fa";


import {
  getDashboardOperator
} from "../../services/dashboardOperatorService";


import StatCard from "../../components/dashboard/StatCard";



export default function Dashboard(){


const [data,setData] = useState(null);



useEffect(()=>{


async function load(){


try{


const operator =
JSON.parse(
localStorage.getItem("operator")
);
console.log(
"ISI LOCAL STORAGE:",
localStorage.getItem("operatorAktif")
);


console.log(
"OPERATOR AKTIF DASHBOARD:",
operator
);



const hasil =
await getDashboardOperator(
operator.gudep_id
);



console.log(
"DASHBOARD OPERATOR:",
hasil
);



setData(hasil);



}catch(error){

console.error(
"DASHBOARD OPERATOR ERROR:",
error
);


}


}


load();



},[]);





if(!data){

return (

<div className="p-10">

Loading Dashboard...

</div>

)

}




return (

<div className="space-y-6">


{/* PROFIL GUDEP */}

<div className="
bg-green-700
text-white
rounded-2xl
p-6
shadow
">


<h1 className="
text-3xl
font-bold
">

🏫 Dashboard Gugus Depan

</h1>


<p className="mt-3 text-lg">

{data.gudep?.nama_pangkalan}

</p>


<p>

Gudep Putra :
{data.gudep?.gudep_putra}

</p>


<p>

Gudep Putri :
{data.gudep?.gudep_putri}

</p>


</div>





{/* STATISTIK */}


<div className="
grid
grid-cols-1
md:grid-cols-4
gap-6
">


<StatCard

title="Total Peserta"

value={
data.peserta.putra +
data.peserta.putri
}

color="#2563eb"

icon={<FaUserGraduate />}

/>



<StatCard

title="Total Pembina"

value={
data.pembina.putra +
data.pembina.putri
}

color="#16a34a"

icon={<FaUserTie />}

/>




<StatCard

title="Jumlah Regu"

value={
data.regu
}

color="#f59e0b"

icon={<FaCampground />}

/>




<StatCard

title="Kapling"

value={
data.kapling?.kapling_putra || "-"
}

color="#7c3aed"

icon={<FaMapMarkerAlt />}

/>


</div>





<div className="
grid
md:grid-cols-2
gap-6
">



{/* PESERTA */}

<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
font-bold
text-xl
">

👦 Peserta

</h2>


<div className="space-y-2 mt-2">

<div className="grid grid-cols-3">
<span>Putra</span>
<span>:</span>
<span>{data.peserta.putra}</span>
</div>


<div className="grid grid-cols-3">
<span>Putri</span>
<span>:</span>
<span>{data.peserta.putri}</span>
</div>


<div className="grid grid-cols-3 font-bold">
<span>Total</span>
<span>:</span>
<span>
{
data.peserta.putra +
data.peserta.putri
}
</span>
</div>

</div>


</div>





{/* PEMBINA */}

<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="
font-bold
text-xl
">

👨‍🏫 Pembina

</h2>


<div className="space-y-2 mt-3">

<div className="grid grid-cols-3">
<span>Putra</span>
<span>:</span>
<span>{data.pembina.putra}</span>
</div>


<div className="grid grid-cols-3">
<span>Putri</span>
<span>:</span>
<span>{data.pembina.putri}</span>
</div>

</div>


</div>



</div>






{/* PEMBAYARAN DAN KAPLING */}


<div className="
grid
md:grid-cols-2
gap-6
">



<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="font-bold text-xl">

💰 Pembayaran

</h2>


<div className="grid grid-cols-3 mt-3">

<span>Status</span>

<span>:</span>

<span>

<span className="
bg-green-100
text-green-700
px-3
py-1
rounded-full
">

{
data.pembayaran?.status || "Belum Ada"
}

</span>

</span>

</div>


</div>





<div className="
bg-white
rounded-xl
shadow
p-6
">


<h2 className="font-bold text-xl">

🏕 Kapling Perkemahan

</h2>


<div className="space-y-2 mt-3">


<div className="grid grid-cols-3">

<span>Blok Putra</span>

<span>:</span>

<span>
{data.kapling?.kapling_putra || "-"}
</span>

</div>



<div className="grid grid-cols-3">

<span>Blok Putri</span>

<span>:</span>

<span>
{data.kapling?.kapling_putri || "-"}
</span>

</div>


</div>


</div>



</div>





</div>

);


}