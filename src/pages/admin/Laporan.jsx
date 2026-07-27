import {
  useEffect,
  useState
} from "react";


import {
  getLaporanAdmin
}
from "../../services/laporanService";


import StatCard from "./StatCard";

export default function Laporan(){


const [data,setData]=useState([]);
const statistik = {

jumlahGudep: data.length,

pembinaPutra: data.reduce(
(total,item)=> total + item.pembinaPutra,
0
),

pembinaPutri: data.reduce(
(total,item)=> total + item.pembinaPutri,
0
),

pesertaPutra: data.reduce(
(total,item)=> total + item.pesertaPutra,
0
),

pesertaPutri: data.reduce(
(total,item)=> total + item.pesertaPutri,
0
),

jumlahRegu: data.reduce(
(total,item)=> total + item.jumlahRegu,
0
)

};


useEffect(()=>{

loadData();

},[]);



async function loadData(){

try{

const hasil =
await getLaporanAdmin();

setData(hasil);


}catch(error){

console.error(error);

}

}



return (

<div className="space-y-6">


<h1 className="
text-3xl
font-bold
text-green-700
">

📊 Laporan Jambore

</h1>

<div className="
grid 
grid-cols-1 
md:grid-cols-3 
gap-6
">


<StatCard
 icon="🏫"
 title="Jumlah Gudep"
 value={statistik.jumlahGudep}
/>


<StatCard

icon="👨"

title="Pembina Putra"

value={statistik.pembinaPutra}

/>


<StatCard

icon="👩"

title="Pembina Putri"

value={statistik.pembinaPutri}

/>


<StatCard

icon="👦"

title="Peserta Putra"

value={statistik.pesertaPutra}

/>


<StatCard

icon="👧"

title="Peserta Putri"

value={statistik.pesertaPutri}

/>


<StatCard

icon="🏕️"

title="Jumlah Regu"

value={statistik.jumlahRegu}

/>


</div>

<div className="
bg-white
rounded-xl
shadow
p-6
">


<table className="
w-full
border
">


<thead className="
bg-green-700
text-white
">


<tr>

<th className="border p-3">
No
</th>


<th className="border p-3">
Nama Gudep
</th>


<th className="border p-3">
Pembina Putra
</th>


<th className="border p-3">
Pembina Putri
</th>


<th className="border p-3">
Peserta Putra
</th>


<th className="border p-3">
Peserta Putri
</th>


<th className="border p-3">
Jumlah Regu
</th>


</tr>


</thead>



<tbody>


{
data.map((item,index)=>(


<tr key={index}>


<td className="border p-3 text-center">
{index+1}
</td>


<td className="border p-3">
{item.nama_gudep}
</td>


<td className="border p-3 text-center">
{item.pembinaPutra}
</td>


<td className="border p-3 text-center">
{item.pembinaPutri}
</td>


<td className="border p-3 text-center">
{item.pesertaPutra}
</td>


<td className="border p-3 text-center">
{item.pesertaPutri}
</td>


<td className="border p-3 text-center">
{item.jumlahRegu}
</td>


</tr>


))

}


</tbody>


</table>


</div>


</div>


);


}