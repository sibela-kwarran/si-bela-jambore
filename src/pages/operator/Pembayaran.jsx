import { useState, useEffect } from "react";



import {
  getRegu
} from "../../services/reguService";

import {
  getPembayaran,
  savePembayaran,
  updatePembayaran
} from "../../services/pembayaranService";

import {
  getProfilGudep,
} from "../../services/profilGudepService";


export default function Pembayaran() {

  const [preview, setPreview] = useState(null);

  
  const [jumlahRegu, setJumlahRegu] = useState(0);

  const [profilGudep,setProfilGudep] = useState({});

  const [profil,setProfil] = useState({});


  const [pembayaran, setPembayaran] = useState({
  bank: "BANK BJB",
  rekening: "0148423563101",
  atasNama: "KWARRAN CIKARANG UTARA",
  biayaPerRegu: 750000,
  bukti: null,
  status: "Belum Bayar",
});

  

  const totalBayar =
  jumlahRegu * pembayaran.biayaPerRegu;

  

async function uploadBukti(e) {

  try {

    const file = e.target.files[0];

    if (!file) return;


    const reader = new FileReader();


   reader.onload = async () => {

  const dataBaru = {

  gudep_id: profil.id,

  bank: pembayaran.bank,

  rekening: pembayaran.rekening,

  atas_nama: pembayaran.atasNama,

  nominal: totalBayar,

  bukti: reader.result,

  status: "Menunggu Verifikasi",

  tanggal: new Date(),

};

  console.log(dataBaru);

  const lama = await getPembayaran();

if (lama) {

  await updatePembayaran(lama.id, dataBaru);

} else {

  await savePembayaran(dataBaru);

}

// ==========================
// MUAT ULANG DATA PEMBAYARAN
// ==========================

await loadDataPembayaran();

  setPembayaran(prev => ({

    ...prev,

    bukti: {

      nama: file.name,

      tipe: file.type,

      file: reader.result,

      tanggal: new Date().toLocaleString("id-ID"),

    },

    status: "Menunggu Verifikasi",

  }));

  alert("Bukti pembayaran berhasil disimpan");

};

    reader.readAsDataURL(file);


  } catch(err) {


    console.error(
      "ERROR PEMBAYARAN:",
      err
    );


    alert(
      "Gagal menyimpan pembayaran"
    );

  }

}

function hapusBukti() {

  if (!window.confirm("Hapus bukti transfer?"))
    return;

  setPembayaran(prev => ({

    ...prev,

    bukti: null,

    status: "Belum Bayar",

  }));

  setPreview(null);

}

function lihatBukti() {

  if (!pembayaran.bukti?.file) {
    alert("File bukti pembayaran tidak ditemukan.");
    return;
  }

  console.log(
    "FILE BUKTI:",
    pembayaran.bukti.file
  );

  setPreview(
    pembayaran.bukti.file
  );

}

useEffect(() => {

  loadProfilGudep();

  loadJumlahRegu();

  loadDataPembayaran();

}, []);



async function loadDataPembayaran() {

  try {

    const data = await getPembayaran();

    console.log("DATA PEMBAYARAN:", data);
    console.log("BUKTI DARI SUPABASE:", data?.bukti);

    if (data) {

      setPembayaran({

  bank: data.bank || "BANK BJB",

  rekening: data.rekening || "0148423563101",

  atasNama: data.atas_nama || "KWARRAN CIKARANG UTARA",

  // BIAYA PER REGU
  biayaPerRegu: Number(data.biaya_per_regu) || 750000,

  nominal: Number(data.nominal) || 0,

  status: data.status || "Belum Bayar",

  tanggal: data.tanggal,

  bukti: data.bukti
          ? {
              nama: "Bukti Pembayaran",

              file: data.bukti,

              tipe: data.bukti.startsWith("data:application/pdf")
                ? "application/pdf"
                : "image",

              tanggal: new Date(data.tanggal)
                .toLocaleString("id-ID"),
            }
          : null,

      });

    }

  } catch (err) {

    console.error(
      "ERROR LOAD PEMBAYARAN:",
      err
    );

  }

}



async function loadJumlahRegu() {

  try {

    const data = await getRegu();

    console.log(
      "DATA REGU PEMBAYARAN:",
      data
    );

    setJumlahRegu(data.length);

  } catch (err) {

    console.error(
      "ERROR REGU PEMBAYARAN:",
      err
    );

  }

}




async function loadProfilGudep() {

  try {

    const data = await getProfilGudep();

    console.log("PROFIL GUDEP:", data);

    setProfil(data);
    setProfilGudep(data);

  } catch (err) {

    console.error(err);

  }

}

  return (

    <div className="space-y-6">

      <div>

        <h1 className="text-3xl font-bold text-green-700">
          Pembayaran
        </h1>

        <p className="text-gray-500">
          Upload bukti pembayaran Jambore.
        </p>

      </div>

      <div className="bg-white rounded-xl shadow p-6">

        <h2 className="text-xl font-bold mb-6">
          Informasi Pembayaran
        </h2>

        <div className="grid grid-cols-2 gap-6">

          <Info
            title="Bank"
            value={pembayaran.bank}
          />

          <Info
            title="Nomor Rekening"
            value={pembayaran.rekening}
          />

          <Info
            title="Atas Nama"
            value={pembayaran.atasNama}
          />

          <Info
  title="Jumlah Regu"
  value={`${jumlahRegu} Regu`}
/>

<Info
  title="Biaya / Regu"
  value={`Rp ${(pembayaran.biayaPerRegu || 750000).toLocaleString("id-ID")}`}
/>

<Info
  title="Total Pembayaran"
  value={`Rp ${Number(totalBayar || 0).toLocaleString("id-ID")}`}
/>

        </div>
<div className="bg-white rounded-xl shadow p-6">

  <h2 className="text-xl font-bold mb-5">

    Upload Bukti Transfer

  </h2>
<label className="inline-block">

  <input
    type="file"
    accept=".jpg,.jpeg,.png,.pdf"
    onChange={uploadBukti}
    className="hidden"
  />

  <span className="cursor-pointer bg-green-700 hover:bg-green-800 text-white px-5 py-3 rounded-lg inline-block">

    ⬆ Upload Bukti Transfer

  </span>

</label>

  {pembayaran.bukti && (

    <div className="space-y-3">

      <p>

        <b>Nama File :</b>

        {pembayaran.bukti.nama}

      </p>

      <p>

        <b>Tanggal Upload :</b>

        {pembayaran.bukti.tanggal}

      </p>

      <p>

        <b>Status :</b>

        <span className="text-orange-600 font-bold">

          {pembayaran.status}

        </span>

      </p>

      <div className="flex gap-3">

        <button
  onClick={lihatBukti}
  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
>
  👁 Lihat
</button>

        <button
          onClick={hapusBukti}
          className="bg-red-600 text-white px-5 py-2 rounded-lg"
        >
          🗑 Hapus
        </button>

      </div>
{preview && (

  <div className="mt-6">

    <h3 className="font-bold mb-3">
      Preview Bukti Transfer
    </h3>

    {pembayaran.bukti?.tipe === "application/pdf" ? (

<button
  onClick={() => {

    if (!preview) {
      alert("File PDF tidak ditemukan.");
      return;
    }

    console.log("MEMBUKA PDF:", preview);

    const win = window.open();

    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Preview Bukti Pembayaran</title>
          </head>
          <body style="margin:0">
            <iframe
              src="${preview}"
              width="100%"
              height="100%"
              style="border:none; height:100vh;"
            ></iframe>
          </body>
        </html>
      `);
      win.document.close();
    }

  }}
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
  📄 Lihat PDF
</button>

) : (

<img
  src={preview}
  alt="Preview"
  className="max-w-lg rounded-lg border shadow"
/>

)}

    <button
      onClick={() => setPreview(null)}
      className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg"
    >
      Tutup Preview
    </button>

  </div>

)}
    </div>

  )}

</div>
      </div>

    </div>

  );

}

function Info({ title, value }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-gray-500">{title}</p>
      <h3 className="text-xl font-bold text-green-700">
        {value}
      </h3>
    </div>
  );
}