import { useState, useEffect } from "react";



export default function Pembayaran() {

  const [preview, setPreview] = useState(null);

  const [pembayaran, setPembayaran] = useState(() => {

    const data = localStorage.getItem("pembayaran");

    return data
      ? JSON.parse(data)
      : {
          bank: "BANK BJB",
          rekening: "0148423563101",
          atasNama: "KWARRAN CIKARANG UTARA",
          biayaPerPeserta: 75000,
          bukti: null,
          status: "Belum Bayar",
        };

  });

  const dataPeserta = JSON.parse(
    localStorage.getItem("dataPeserta") || "[]"
  );

  const jumlahPeserta = dataPeserta.length;

  const totalBayar =
    jumlahPeserta * pembayaran.biayaPerPeserta;

  useEffect(() => {

    localStorage.setItem(
      "pembayaran",
      JSON.stringify(pembayaran)
    );

  }, [pembayaran]);

function uploadBukti(e) {

  const file = e.target.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {

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

  };

  reader.readAsDataURL(file);

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

  if (!pembayaran.bukti) return;


  // jika PDF buka tab baru
  if (
    pembayaran.bukti.tipe === "application/pdf" ||
    pembayaran.bukti.file.includes("application/pdf")
  ) {

    window.open(
      pembayaran.bukti.file,
      "_blank"
    );

    return;

  }


  // jika gambar tampilkan preview
  setPreview(
    pembayaran.bukti.file
  );

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

    <img
      src={preview}
      alt="Bukti Transfer"
      className="max-w-lg rounded-lg border shadow"
    />

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