import { useState, useEffect } from "react";




export default function UploadBerkas() {


  const [berkas, setBerkas] = useState(() => {

    const data = localStorage.getItem("uploadBerkas");

    return data
      ? JSON.parse(data)
      : {
          suratTugas: null,
          suratIzin: null,
        };

  });



  useEffect(() => {

    localStorage.setItem(
      "uploadBerkas",
      JSON.stringify(berkas)
    );

  }, [berkas]);





  function downloadTemplate(file) {

  const link = document.createElement("a");

  link.href = file;

  link.setAttribute("download", "");

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

}




  function uploadBerkas(e, jenis) {

  const file = e.target.files[0];

  if (!file) return;

  if (file.type !== "application/pdf") {

    alert("Berkas harus berupa PDF.");

    return;

  }

  const reader = new FileReader();

  reader.onload = () => {

    setBerkas((prev) => ({

      ...prev,

      [jenis]: {

        nama: file.name,

        tipe: file.type,

        file: reader.result,

        tanggal: new Date().toLocaleString("id-ID")

      }

    }));

  };

  reader.readAsDataURL(file);

}





  function hapusBerkas(jenis){

    if(!window.confirm("Hapus berkas ini?"))
      return;


    setBerkas((prev)=>({

      ...prev,

      [jenis]: null

    }));

  }





  const jumlahUpload =
    (berkas.suratTugas ? 1 : 0) +
    (berkas.suratIzin ? 1 : 0);



  const persen = (jumlahUpload / 2) * 100;




return (

<div className="space-y-6">


<div>

<h1 className="text-3xl font-bold text-green-700">
Upload Berkas PDF
</h1>

<p className="text-gray-500">
Upload dokumen persyaratan pendaftaran Jambore.
</p>

</div>





{/* SURAT TUGAS */}


<div className="bg-white rounded-xl shadow p-6">


<h2 className="text-xl font-bold">
1. Surat Tugas Mabigus
</h2>


<p className="text-gray-500 mt-2">
Download template, isi kemudian upload kembali.
</p>




<div className="mt-5 flex gap-3">


<button
  onClick={() =>
    downloadTemplate("/template/Surat_Tugas_Mabigus.docx")
  }
  className="bg-blue-600 text-white px-5 py-3 rounded-lg"
>
  ⬇ Download Template
</button>





<label

className="bg-green-700 text-white px-5 py-3 rounded-lg cursor-pointer"

>

⬆ Upload Berkas PDF


<input
  type="file"
  accept=".pdf"
  hidden
  onChange={(e)=>uploadBerkas(e,"suratTugas")}
/>


</label>





<button

onClick={()=>hapusBerkas("suratTugas")}

className="bg-red-600 text-white px-5 py-3 rounded-lg"

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



<div className="bg-white rounded-xl shadow p-6">


<h2 className="text-xl font-bold">

2. Surat Izin Orang Tua

</h2>



<p className="text-gray-500 mt-2">

Template akan mengikuti jumlah peserta yang telah didaftarkan.

</p>





<div className="mt-5 flex gap-3">



<button
  onClick={() =>
    downloadTemplate("/template/Surat_Izin_Orang_Tua.docx")
  }
  className="bg-blue-600 text-white px-5 py-3 rounded-lg"
>
  ⬇ Download Template
</button>





<label

className="bg-green-700 text-white px-5 py-3 rounded-lg cursor-pointer"

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

className="bg-red-600 text-white px-5 py-3 rounded-lg"

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



<div className="bg-white rounded-xl shadow p-6">


<div className="flex justify-between">


<div>

<h2 className="text-xl font-bold">

Progress Kelengkapan Berkas

</h2>


<p className="text-gray-500">

{jumlahUpload} dari 2 berkas telah tersedia

</p>


</div>



<div className="text-3xl font-bold text-green-700">

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