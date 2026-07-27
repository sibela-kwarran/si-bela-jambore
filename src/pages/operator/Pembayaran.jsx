import { useState, useEffect } from "react";

import {
  getPeserta
} from "../../services/pesertaService";

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

  const [jumlahPeserta,setJumlahPeserta] = useState(0);

  const [profilGudep,setProfilGudep] = useState({});

  const [profil,setProfil] = useState({});


  const [pembayaran, setPembayaran] = useState({
  bank: "BANK BJB",
  rekening: "0148423563101",
  atasNama: "KWARRAN CIKARANG UTARA",
  biayaPerPeserta: 75000,
  bukti: null,
  status: "Belum Bayar",
});

  

  const totalBayar =
    jumlahPeserta * pembayaran.biayaPerPeserta;

  

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

  jumlah_peserta: jumlahPeserta,

};

  console.log(dataBaru);

  const lama = await getPembayaran();

if (lama) {

  await updatePembayaran(lama.id, dataBaru);

} else {

  await savePembayaran(dataBaru);
await loadDataPembayaran();
}

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

function lihatBukti(){

  if(!pembayaran.bukti) return;


  setPreview(
    pembayaran.bukti.file
  );

}

useEffect(() => {
  loadProfilGudep();
  loadJumlahPeserta();
  loadDataPembayaran();
}, []);



async function loadDataPembayaran(){

try{


const data = await getPembayaran();


if (data) {

  setPembayaran({

    bank: data.bank,

    rekening: data.rekening,

    atasNama: data.atas_nama,

    biayaPerPeserta: data.biaya_per_peserta,

    nominal: data.nominal,

    status: data.status,

    tanggal: data.tanggal,

    bukti: data.bukti
? {
    nama: "Bukti Pembayaran",
    file: data.bukti,
    tipe: "application/pdf",
    tanggal: new Date(data.tanggal)
      .toLocaleString("id-ID"),
  }
: null,

  });

}


}catch(err){

console.error(err);

}


}

async function loadJumlahPeserta(){

  try{

    const data = await getPeserta();

    console.log(
      "DATA PESERTA PEMBAYARAN:",
      data
    );


    setJumlahPeserta(data.length);


  }catch(err){

    console.error(
      "ERROR PESERTA:",
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
            title="Jumlah Peserta"
            value={`${jumlahPeserta} Orang`}
          />

          <Info
            title="Biaya / Peserta"
            value={`Rp ${pembayaran.biayaPerPeserta.toLocaleString("id-ID")}`}
          />

          <Info
            title="Total Pembayaran"
            value={`Rp ${totalBayar.toLocaleString("id-ID")}`}
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

<a
  href={preview}
  target="_blank"
  rel="noreferrer"
  className="bg-blue-600 text-white px-4 py-2 rounded"
>
📄 Lihat PDF
</a>

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