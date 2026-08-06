import { useState, useEffect } from "react";

import {
 uploadFile,
 getBerkas,
 saveBerkas,
 updateBerkas,
 deleteBerkas,
 deleteFile,
} from "../../services/berkasService";

import {
  getProfilGudep,
} from "../../services/profilGudepService";





function downloadTemplate(file) {

  const link = document.createElement("a");

  link.href = file;

  link.download = file.split("/").pop();

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

}


export default function UploadBerkas() {

  const [berkas, setBerkas] = useState({
    suratTugas: null,
    suratIzin: null,
  });


  const [profil, setProfil] = useState({});


  useEffect(() => {

    loadData();

  }, []);



  async function loadData(){

  try {

    const profilGudep = await getProfilGudep();

    setProfil(profilGudep || {});


    const data = await getBerkas();

    console.log("DATA BERKAS SUPABASE:", data);


    if(data && data.length > 0){

      const item = data[0];

      console.log("ITEM BERKAS:", item);


      setBerkas({

 suratTugas: item.surat_tugas
 ? {
     id:item.id,
     nama:"Surat_Tugas_Mabigus.pdf",
     url:item.surat_tugas
 }
 : null,

 suratIzin: item.surat_izin
 ? {
     id:item.id,
     nama:"Surat_Izin_Orang_Tua.pdf",
     url:item.surat_izin
 }
 : null

});

    }


  } catch(err){

    console.error("LOAD BERKAS ERROR:", err);

  }

}





  async function uploadBerkas(e, jenis){


    try {


      const file = e.target.files[0];


      if(!file) return;



      if(file.type !== "application/pdf"){

        alert("Berkas harus PDF");

        return;

      }



      // Upload ke Storage

      const url = await uploadFile(
        file,
        jenis
      );



      console.log(
        "PROFIL SAAT UPLOAD:",
        profil
      );



      const data = {

  gudep_id: profil.id,

  surat_tugas:
    jenis === "suratTugas"
      ? url
      : berkas.suratTugas?.url || null,

  surat_izin:
    jenis === "suratIzin"
      ? url
      : berkas.suratIzin?.url || null,

  status:"Lengkap"

};



      console.log(
 "DATA BERKAS DIKIRIM:",
 JSON.stringify(data,null,2)
);



      const dataLama = await getBerkas();


if(dataLama.length > 0){

  await updateBerkas(
    dataLama[0].id,
    data
  );

}else{

  await saveBerkas(data);

}



      setBerkas((prev)=>({


        ...prev,


        [jenis]:{


          nama:file.name,


          url:url


        }


      }));



      alert("Berkas berhasil diupload");


    } catch(err){


      console.error(
        "UPLOAD ERROR:",
        err
      );


      alert(
        "Gagal upload berkas"
      );


    }


  }





 async function hapusBerkas(jenis){

try{

const file = berkas[jenis];

console.log("BERKAS DIHAPUS:",file);


if(!file){
 alert("Berkas tidak ditemukan");
 return;
}


// hapus database
await deleteBerkas(file.id);


// hapus storage
await deleteFile(file.url);



setBerkas(prev=>({
 ...prev,
 [jenis]:null
}));


alert("Berkas berhasil dihapus");


}catch(err){

console.error(
"GAGAL HAPUS:",
err
);

alert("Gagal menghapus berkas");

}

}




  const jumlahUpload =
    (berkas.suratTugas ? 1 : 0) +
    (berkas.suratIzin ? 1 : 0);



  const persen = (jumlahUpload / 2) * 100;







return (

<div className="space-y-6">


<div>

<h1 className="text-2xl sm:text-3xl font-bold text-green-700">
Upload Berkas PDF
</h1>

<p className="text-gray-500">
Upload dokumen persyaratan pendaftaran Jambore.
</p>

</div>





{/* SURAT TUGAS */}


<div className="bg-white rounded-xl shadow p-4 sm:p-6">


<h2 className="text-lg sm:text-xl font-bold">
1. Surat Tugas Mabigus
</h2>


<p className="text-gray-500 mt-2">
Download template, isi kemudian upload kembali.
</p>




<div className="mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">


<button
  onClick={() =>
    downloadTemplate("/template/Surat_Tugas_Mabigus.docx")
  }
  className="bg-blue-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg"
>
  ⬇ Download Template
</button>





<label
  className="bg-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg cursor-pointer text-center"
>
  ⬆ Upload Berkas PDF

  <input
    type="file"
    accept=".pdf"
    hidden
    onChange={(e) => uploadBerkas(e, "suratTugas")}
  />
</label>





<button
  onClick={() => hapusBerkas("suratTugas")}
  className="bg-red-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg"
>
  🗑 Hapus
</button>



</div>




{

berkas.suratTugas &&

<p className="mt-3 text-green-700">

✅ {berkas.suratTugas.nama}

</p>

}


</div>









{/* SURAT IZIN */}



<div className="bg-white rounded-xl shadow p-4 sm:p-6">


<h2 className="text-xl font-bold">

2. Surat Izin Orang Tua

</h2>



<p className="text-gray-500 mt-2">

Template akan mengikuti jumlah peserta yang telah didaftarkan.

</p>





<div className="mt-5 flex flex-col sm:flex-row gap-2 sm:gap-3">



<button
  onClick={() =>
    downloadTemplate("/template/Surat_Izin_Orang_Tua.docx")
  }
  className="bg-blue-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg"
>
  ⬇ Download Template
</button>





<label

className="bg-green-700 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg cursor-pointer"

>

⬆ Upload Berkas PDF


<input
  type="file"
  accept=".pdf"
  hidden
  onChange={(e)=>uploadBerkas(e,"suratIzin")}
/>


</label>





<button

onClick={()=>hapusBerkas("suratIzin")}

className="bg-red-600 text-white px-4 py-2.5 sm:px-5 sm:py-3 rounded-lg"

>

🗑 Hapus

</button>



</div>



{

berkas.suratIzin &&

<p className="mt-3 text-green-700">

✅ {berkas.suratIzin.nama}

</p>

}



</div>









{/* PROGRESS */}



<div className="bg-white rounded-xl shadow p-4 sm:p-6">


<div className="flex justify-between items-center gap-3">


<div>

<h2 className="text-lg sm:text-xl font-bold">

Progress Kelengkapan Berkas

</h2>


<p className="text-gray-500">

{jumlahUpload} dari 2 berkas telah tersedia

</p>


</div>



<div className="text-2xl sm:text-3xl font-bold text-green-700">

{persen}%

</div>



</div>





<div className="w-full bg-gray-200 rounded-full h-4 mt-5">


<div

className="bg-green-600 h-4 rounded-full"

style={{

width:`${persen}%`

}}

/>


</div>


</div>



</div>


);


}