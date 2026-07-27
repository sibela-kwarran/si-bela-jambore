import { useState, useEffect } from "react";

import {
  getSemuaBerkasAdmin,
  updateBerkas
} from "../../services/berkasService";


// Komponen kecil untuk detail
function Info({ title, value }) {

  return (

    <div className="border rounded-lg p-4">

      <p className="text-gray-500">
        {title}
      </p>

      <h2 className="text-xl font-bold">
        {value || "-"}
      </h2>

    </div>

  );

}



export default function VerifikasiBerkas() {


  const [data,setData] = useState([]);

  const [selected,setSelected] = useState(null);



  // ambil data saat halaman dibuka
  useEffect(()=>{

    loadBerkas();

  },[]);



  async function loadBerkas(){

    try{

      const hasil = await getSemuaBerkasAdmin();

      console.log("DATA BERKAS ADMIN :",hasil);

      setData(hasil || []);


    }catch(error){

      console.error(
        "Gagal mengambil berkas:",
        error
      );

    }

  }



  async function ubahStatus(status){


    try{


      await updateBerkas(

        selected.id,

        {
          status:status
        }

      );


      alert(
        "Status berhasil diperbarui"
      );


      setSelected(null);


      loadBerkas();



    }catch(error){

      console.error(error);

    }


  }

  return (

<div className="space-y-6">

<h1 className="text-3xl font-bold text-amber-700">
  Verifikasi Berkas
</h1>


<div className="bg-white rounded-xl shadow overflow-hidden">

<table className="w-full">

<thead className="bg-amber-700 text-white">

<tr>

<th className="p-3">No</th>

<th>Gudep</th>

<th>Surat Tugas</th>

<th>Surat Izin</th>

<th>Status</th>

<th>Aksi</th>

</tr>

</thead>


<tbody>


{data.length === 0 ? (

<tr>

<td 
colSpan="6"
className="text-center p-5"
>

Belum ada data.

</td>

</tr>


) : (


data.map((item,index)=>(


<tr 
key={item.id}
className="border-b"
>


<td className="p-3 text-center">
{index+1}
</td>



<td>
{
item.profil_gudep?.nama_pangkalan 
|| "-"
}
</td>



<td className="text-center">

{
item.surat_tugas
?
"📄 Ada"
:
"-"
}

</td>



<td className="text-center">

{
item.surat_izin
?
"📄 Ada"
:
"-"
}

</td>



<td className="text-center">

<span className="
bg-yellow-100 
text-yellow-700 
px-3 py-1 
rounded-full
">

{item.status || "Menunggu"}

</span>

</td>



<td className="text-center">

<button
  onClick={() => {
    console.log("DETAIL BERKAS :", item);
    setSelected(item);
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  Lihat
</button>


</td>


</tr>


))

)}


</tbody>


</table>


</div>
{selected && (

<div className="bg-white rounded-xl shadow p-6">

<h2 className="text-2xl font-bold text-amber-700 mb-5">
Detail Berkas
</h2>


<div className="grid grid-cols-2 gap-5 mb-6">


<Info
 title="Gudep"
 value={
 selected.profil_gudep?.nama_pangkalan
 }
/>


<Info
 title="Status"
 value={selected.status}
/>


</div>



<h3 className="text-xl font-bold mb-3">
📄 Surat Tugas Mabigus
</h3>


{
selected.surat_tugas ? (

<iframe

src={selected.surat_tugas}

className="w-full h-[600px] border rounded-lg mb-6"

title="Surat Tugas"

/>

)

:

(

<p className="text-red-600">
Belum ada surat tugas
</p>

)

}



<h3 className="text-xl font-bold mb-3">
📄 Surat Izin Orang Tua
</h3>


{
selected.surat_izin ? (

<iframe

src={selected.surat_izin}

className="w-full h-[600px] border rounded-lg"

title="Surat Izin"

/>

)

:

(

<p className="text-red-600">
Belum ada surat izin
</p>

)

}



<div className="flex gap-3 mt-6">


<button

onClick={()=>ubahStatus("Terverifikasi")}

className="bg-green-700 text-white px-6 py-3 rounded-lg"

>
✔ Verifikasi
</button>



<button

onClick={()=>ubahStatus("Ditolak")}

className="bg-red-600 text-white px-6 py-3 rounded-lg"

>
✖ Tolak
</button>


</div>


</div>

)}

</div>


);

}