import { useEffect, useState } from "react";

import {
  getPembayaranLunas
} from "../../services/pembayaranService";


import {
  getBlok,
  savePenempatanBlok,
  savePeta
} from "../../services/kaplingService";


export default function PenempatanBlok(){


const [data,setData] = useState([]);

const [loading,setLoading] = useState(true);



useEffect(()=>{

loadBlok();

},[]);



// =================================
// AMBIL DATA KAPLING
// =================================

async function loadBlok(){

try{


const hasil = await getBlok();


console.log(
"DATA KAPLING :",
hasil
);



const tampil = hasil.map(item => ({

id:item.id,

gudep_id:item.gudep_id,


namaGudep:
item.profil_gudep?.nama_pangkalan || "-",


blokPutra:"Putra",

kecamatanPutra:
item.kecamatan_putra,

kelurahanPutra:
item.kelurahan_putra,

kaplingPutra:
item.kapling_putra,



blokPutri:"Putri",

kecamatanPutri:
item.kecamatan_putri,

kelurahanPutri:
item.kelurahan_putri,

kaplingPutri:
item.kapling_putri,


status:item.status


}));



setData(tampil);



}catch(error){

console.error(error);


}

finally{

setLoading(false);

}


}



// =================================
// GENERATE KAPLING
// =================================

async function handleGenerate(){


try{


const pembayaran =
await getPembayaranLunas();
console.log(
 "DATA AKAN DIGENERATE:",
 pembayaran
);


let nomor = 1;

const sudahGenerate = [...data];

for(const item of pembayaran){


  // CEK APAKAH GUDEP SUDAH ADA KAPLING
  const sudahAda = sudahGenerate.find(
  (x) => x.gudep_id === item.gudep_id
);


  if(sudahAda){
    console.log(
      "Lewat karena sudah ada:",
      item.gudep_id
    );

    continue;
  }



const kapling =
String(nomor)
.padStart(2,"0");



// =================
// SIMPAN KAPLING
// =================


await savePenempatanBlok({


gudep_id:item.gudep_id,


kecamatan_putra:
"Soekarno",


kelurahan_putra:
"Diponegoro",


kapling_putra:
kapling,


kecamatan_putri:
"R.A Kartini",


kelurahan_putri:
"Dewi Sartika",


kapling_putri:
kapling,


status:
"Sudah Dibuat"


});







sudahGenerate.push({
  gudep_id:item.gudep_id
});




nomor++;


}



alert(
"✅ Generate Kapling berhasil"
);



loadBlok();



}catch(error){


console.error(
"GENERATE ERROR:",
error
);


alert(
"Gagal membuat kapling"
);


}


}




return (

<div className="space-y-6">


<h1 className="text-3xl font-bold text-green-700">
Penempatan Blok Perkemahan
</h1>



<div className="bg-white rounded-xl shadow p-6">


<div className="flex justify-between mb-5">


<div>

<h2 className="text-xl font-bold">
Daftar Penempatan Gudep
</h2>


<p>
Jumlah Gudep :
<b> {data.length}</b>
</p>


</div>



<button

onClick={handleGenerate}

className="
bg-green-600
text-white
px-5
py-3
rounded-lg
font-bold
"

>

⚙ Generate Kapling

</button>


</div>




<table className="w-full border">


<thead className="bg-green-700 text-white">

<tr>

<th className="border p-3">
No
</th>

<th className="border p-3">
Gudep
</th>

<th className="border p-3">
Blok Putra
</th>

<th className="border p-3">
Kecamatan Putra
</th>

<th className="border p-3">
Kelurahan Putra
</th>

<th className="border p-3">
Kapling Putra
</th>

<th className="border p-3">
Blok Putri
</th>

<th className="border p-3">
Kecamatan Putri
</th>

<th className="border p-3">
Kelurahan Putri
</th>

<th className="border p-3">
Kapling Putri
</th>

<th className="border p-3">
Status
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
{item.namaGudep}
</td>


<td className="border p-3 text-center">
{item.blokPutra}
</td>


<td className="border p-3">
{item.kecamatanPutra}
</td>


<td className="border p-3">
{item.kelurahanPutra}
</td>


<td className="border p-3 text-center">
{item.kaplingPutra}
</td>


<td className="border p-3 text-center">
{item.blokPutri}
</td>


<td className="border p-3">
{item.kecamatanPutri}
</td>


<td className="border p-3">
{item.kelurahanPutri}
</td>


<td className="border p-3 text-center">
{item.kaplingPutri}
</td>


<td className="border p-3 text-center">

<span className="
bg-green-100 
text-green-700 
px-3 
py-1 
rounded-full
">

{item.status}

</span>

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