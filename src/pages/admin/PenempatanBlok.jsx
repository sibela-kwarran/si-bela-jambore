import { useEffect, useState } from "react";

import {
  getPembayaranLunas
} from "../../services/pembayaranService";

import {
  getBlok,
  savePenempatanBlok,
  savePeta,
  getNomorKaplingBerikutnya
} from "../../services/kaplingService";

import {
  getJenisRegu
} from "../../services/reguService";

import {
  wilayahCikarangUtara
} from "../../data/wilayahCikarangUtara";

import {
  getSemuaPendaftaran
} from "../../services/pendaftaranService";




export default function PenempatanBlok() {

  const [data, setData] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

const [selectedGudep, setSelectedGudep] = useState(null);

const [nomorKapling, setNomorKapling] = useState({
  putra: null,
  putri: null,
});

const [formPenempatan, setFormPenempatan] = useState({

  kecamatanPutra:
    wilayahCikarangUtara.putra.kecamatan,

  kelurahanPutra: "",

  kecamatanPutri:
    wilayahCikarangUtara.putri.kecamatan,

  kelurahanPutri: "",


});

  // =====================================
  // LOAD DATA
  // =====================================

  useEffect(() => {

    loadData();

  }, []);


  async function loadData() {

    try {

      setLoading(true);

      // =====================================
      // AMBIL PENDAFTARAN
      // =====================================

      const pendaftaran =
        await getSemuaPendaftaran();

      console.log(
        "SEMUA PENDAFTARAN:",
        pendaftaran
      );
console.log(
  "STATUS SEMUA PENDAFTARAN:",
  (pendaftaran || []).map(item => ({
    id: item.id,
    gudep_id: item.gudep_id,
    nama: item.nama_gudep,
    status: item.status,
  }))
);

      // =====================================
      // HANYA YANG TERVERIFIKASI
      // =====================================

      const terverifikasi =
  (pendaftaran || []).filter(
    item =>
      String(item.status || "")
        .trim()
        .toLowerCase() === "terverifikasi"
  );

      console.log(
        "GUDEP TERVERIFIKASI:",
        terverifikasi
      );


      // =====================================
      // AMBIL DATA REGU
      // =====================================

      const hasil = [];


      for (const item of terverifikasi) {

        const gudepId =
          item.gudep_id;


        const regu =
          await getJenisRegu(gudepId);


        console.log(
          "JENIS REGU:",
          gudepId,
          regu
        );


        // =====================================
        // CEK SUDAH DITEMPATKAN
        // =====================================

        const penempatan =
          await getBlok();


        const sudahDitempatkan =
          (penempatan || []).find(
            p =>
              Number(p.gudep_id) ===
              Number(gudepId)
          );


        hasil.push({

          id: item.id,

          gudep_id: gudepId,

          namaGudep:
            item.nama_gudep ||
            item.profil_gudep?.nama_pangkalan ||
            "-",

          adaPutra:
            Boolean(regu?.adaPutra),

          adaPutri:
            Boolean(regu?.adaPutri),

          status:
            sudahDitempatkan
              ? "Sudah Ditempatkan"
              : "Belum Ditempatkan",

          penempatan:
            sudahDitempatkan || null,

        });

      }


      console.log(
        "DATA PENEMPATAN:",
        hasil
      );


      setData(hasil);


    } catch (error) {

      console.error(
        "PENEMPATAN BLOK ERROR:",
        error
      );

    } finally {

      setLoading(false);

    }

  }
// =====================================
// NOMOR KAPLING BERIKUTNYA
// =====================================

function getNomorBerikutnya(data, jenis) {

  const field =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";

  const nomor = data
    .map(item => Number(item[field]))
    .filter(n => !isNaN(n) && n > 0);

  if (nomor.length === 0) {
    return 1;
  }

  return Math.max(...nomor) + 1;
}

// =====================================
// CARI NOMOR KAPLING TERKECIL YANG BELUM DIPAKAI
// =====================================

function getNomorKosong(data, jenis) {

  const field =
    jenis === "putra"
      ? "kapling_putra"
      : "kapling_putri";

  const nomorTerpakai = (data || [])
    .map(item => Number(item[field]))
    .filter(n => !isNaN(n) && n > 0);

  let nomor = 1;

  while (nomorTerpakai.includes(nomor)) {
    nomor++;
  }

  return nomor;
}






 // =====================================
// TOMBOL TEMPATKAN
// =====================================

function handleTempatkan(item) {

  console.log(
    "GUDEP YANG DIPILIH:",
    item
  );

  setSelectedGudep(item);

  setFormPenempatan({

    kecamatanPutra:
      wilayahCikarangUtara.putra.kecamatan,

    kelurahanPutra: "",

    kecamatanPutri:
      wilayahCikarangUtara.putri.kecamatan,

    kelurahanPutri: "",

  });


  // =====================================
  // HITUNG NOMOR KAPLING OTOMATIS
  // =====================================

  const nomorPutra = item.adaPutra
    ? getNomorKosong(
        data.map(x => x.penempatan).filter(Boolean),
        "putra"
      )
    : null;


  const nomorPutri = item.adaPutri
    ? getNomorKosong(
        data.map(x => x.penempatan).filter(Boolean),
        "putri"
      )
    : null;


  console.log(
    "NOMOR OTOMATIS:",
    {
      putra: nomorPutra,
      putri: nomorPutri
    }
  );


  setNomorKapling({

    putra: nomorPutra,

    putri: nomorPutri,

  });


  setModalOpen(true);

}

// =====================================
// CARI NOMOR KAPLING YANG MASIH KOSONG
// =====================================

function getNomorBerikutnya(semuaBlok, jenis) {

  const nomorTerpakai = semuaBlok
    .map(item => {

      if (jenis === "putra") {
        return item.kapling_putra;
      }

      if (jenis === "putri") {
        return item.kapling_putri;
      }

      return null;

    })
    .filter(Boolean)
    .map(nomor => Number(nomor))
    .filter(nomor => !isNaN(nomor));


  let nomor = 1;

  while (nomorTerpakai.includes(nomor)) {
    nomor++;
  }

  return nomor;
}





async function handleSimpanPenempatan() {

  if (!selectedGudep) {
    return;
  }

  try {

    setLoading(true);

    // =====================================
    // AMBIL DATA PENEMPATAN TERBARU
    // =====================================

    const semuaBlok = await getBlok();

    console.log(
      "DATA BLOK SEBELUM PENEMPATAN:",
      semuaBlok
    );


    // =====================================
    // NOMOR PUTRA
    // =====================================

    const nomorPutra =
      selectedGudep.adaPutra
        ? getNomorBerikutnya(
            semuaBlok,
            "putra"
          )
        : null;


    // =====================================
    // NOMOR PUTRI
    // =====================================

    const nomorPutri =
      selectedGudep.adaPutri
        ? getNomorBerikutnya(
            semuaBlok,
            "putri"
          )
        : null;


    // =====================================
    // DATA YANG DISIMPAN
    // =====================================

    const dataSimpan = {

      gudep_id:
        selectedGudep.gudep_id,

      kecamatan_putra:
        selectedGudep.adaPutra
          ? formPenempatan.kecamatanPutra
          : null,

      kelurahan_putra:
        selectedGudep.adaPutra
          ? formPenempatan.kelurahanPutra
          : null,

      kapling_putra:
        selectedGudep.adaPutra
          ? String(nomorPutra).padStart(2, "0")
          : null,

      kecamatan_putri:
        selectedGudep.adaPutri
          ? formPenempatan.kecamatanPutri
          : null,

      kelurahan_putri:
        selectedGudep.adaPutri
          ? formPenempatan.kelurahanPutri
          : null,

      kapling_putri:
        selectedGudep.adaPutri
          ? String(nomorPutri).padStart(2, "0")
          : null,

      status:
        "Sudah Ditempatkan",

    };


    console.log(
      "DATA PENEMPATAN YANG DISIMPAN:",
      dataSimpan
    );


    // =====================================
    // SIMPAN SUPABASE
    // =====================================

    await savePenempatanBlok(
      dataSimpan
    );


    alert(
      "✅ Gudep berhasil ditempatkan."
    );


    // =====================================
    // TUTUP MODAL
    // =====================================

    setModalOpen(false);

    setSelectedGudep(null);


    // =====================================
    // REFRESH DATA
    // =====================================

    await loadData();


  } catch (error) {

    console.error(
      "GAGAL MENYIMPAN PENEMPATAN:",
      error
    );

    alert(
      "❌ Gagal menyimpan penempatan."
    );

  } finally {

    setLoading(false);

  }

}

  // =====================================
  // LOADING
  // =====================================

  if (loading) {

    return (

      <div className="bg-white rounded-xl shadow p-8">

        Memuat data penempatan...

      </div>

    );

  }
function getNomorBerikutnya(dataLama, jenis) {

  const nomor = dataLama
    .map(item => {

      const nilai =
        jenis === "putra"
          ? item.kapling_putra
          : item.kapling_putri;

      return parseInt(nilai, 10) || 0;

    })
    .filter(n => n > 0);

  if (nomor.length === 0) {
    return 1;
  }

  return Math.max(...nomor) + 1;

}

  // =====================================
  // TAMPILAN
  // =====================================

  return (

    <div className="space-y-6">


      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-green-700">

          📍 Penempatan Blok Perkemahan

        </h1>

        <p className="text-gray-500 mt-1">

          Kelola penempatan Gudep yang telah
          terverifikasi.

        </p>

      </div>


      {/* CARD JUMLAH */}

      <div className="bg-white rounded-xl shadow p-6">

        <div className="flex justify-between items-center">

          <div>

            <h2 className="text-xl font-bold">

              Daftar Gudep Terverifikasi

            </h2>

            <p className="text-gray-500">

              Gudep siap ditempatkan ke blok
              perkemahan.

            </p>

          </div>


          <div className="text-right">

            <div className="text-3xl font-bold text-green-700">

              {data.length}

            </div>

            <div className="text-sm text-gray-500">

              Gudep

            </div>

          </div>

        </div>

      </div>


      {/* TABEL */}

      <div className="bg-white rounded-xl shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full border-collapse">


            <thead className="bg-green-700 text-white">

              <tr>

                <th className="border p-3">
                  No
                </th>

                <th className="border p-3">
                  Gudep
                </th>

                <th className="border p-3">
                  Regu Putra
                </th>

                <th className="border p-3">
                  Regu Putri
                </th>

                <th className="border p-3">
                  Status
                </th>

                <th className="border p-3">
                  Aksi
                </th>

              </tr>

            </thead>


            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="p-8 text-center text-gray-500"
                  >

                    Belum ada Gudep yang
                    terverifikasi.

                  </td>

                </tr>

              ) : (

                data.map((item, index) => (

                  <tr
                    key={item.gudep_id}
                    className="hover:bg-gray-50"
                  >

                    <td className="border p-3 text-center">

                      {index + 1}

                    </td>


                    <td className="border p-3 font-semibold">

                      {item.namaGudep}

                    </td>


                    <td className="border p-3 text-center">

                      {item.adaPutra ? (
                        <span className="text-green-600 font-bold">
                          ✓ Ada
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          —
                        </span>
                      )}

                    </td>


                    <td className="border p-3 text-center">

                      {item.adaPutri ? (
                        <span className="text-pink-600 font-bold">
                          ✓ Ada
                        </span>
                      ) : (
                        <span className="text-gray-400">
                          —
                        </span>
                      )}

                    </td>


                    <td className="border p-3 text-center">

                      {item.status ===
                      "Sudah Ditempatkan" ? (

                        <span className="
                          bg-green-100
                          text-green-700
                          px-3
                          py-1
                          rounded-full
                          font-semibold
                        ">

                          ✓ Sudah Ditempatkan

                        </span>

                      ) : (

                        <span className="
                          bg-yellow-100
                          text-yellow-700
                          px-3
                          py-1
                          rounded-full
                          font-semibold
                        ">

                          ⏳ Belum Ditempatkan

                        </span>

                      )}

                    </td>


                    <td className="border p-3 text-center">

                      <button

                        onClick={() =>
                          handleTempatkan(item)
                        }

                        className="
                          bg-blue-600
                          hover:bg-blue-700
                          text-white
                          px-4
                          py-2
                          rounded-lg
                          font-semibold
                        "

                      >

                        📍 Tempatkan

                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>
  {/* =====================================
    MODAL TEMPATKAN GUDEP
===================================== */}

{modalOpen && selectedGudep && (

  <div className="
    fixed
    inset-0
    bg-black/50
    flex
    items-center
    justify-center
    z-50
    p-4
  ">

    <div className="
      bg-white
      rounded-2xl
      shadow-2xl
      w-full
      max-w-xl
      max-h-[90vh]
      overflow-y-auto
      p-6
    ">

      {/* HEADER */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="
            text-2xl
            font-bold
            text-green-700
          ">
            📍 Tempatkan Gudep
          </h2>

          <p className="text-gray-500 mt-1">
            {selectedGudep.namaGudep}
          </p>

        </div>

        <button
          onClick={() => {
            setModalOpen(false);
            setSelectedGudep(null);
          }}
          className="
            text-gray-500
            hover:text-red-600
            text-2xl
          "
        >
          ✕
        </button>

      </div>


      {/* =================================
          PUTRA
      ================================= */}

      {selectedGudep.adaPutra && (

        <div className="
          border
          border-blue-200
          rounded-xl
          p-5
          mb-5
          bg-blue-50
        ">

          <h3 className="
            text-lg
            font-bold
            text-blue-700
            mb-4
          ">
            🧑 Blok Putra
          </h3>


          {/* KECAMATAN */}

          <label className="
            block
            text-sm
            font-semibold
            mb-2
          ">
            Kecamatan
          </label>

          <input
            type="text"
            value={
              wilayahCikarangUtara.putra.kecamatan
            }
            readOnly
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-gray-100
              mb-4
            "
          />


          {/* KELURAHAN */}

          <label className="
            block
            text-sm
            font-semibold
            mb-2
          ">
            Kelurahan
          </label>

          <select
            value={
              formPenempatan.kelurahanPutra
            }
            onChange={async (e) => {

  const kelurahan =
    e.target.value;

  setFormPenempatan(prev => ({
    ...prev,

    kelurahanPutra:
      kelurahan,

  }));

  if (kelurahan) {

    await cekNomorKapling("putra");

  } else {

    setNomorKapling(prev => ({
      ...prev,
      putra: null,
    }));

  }

}}
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-white
              mb-4
            "
          >

            <option value="">
              Pilih Kelurahan
            </option>

            {wilayahCikarangUtara.putra.kelurahan.map(
              (kelurahan) => (

                <option
                  key={kelurahan}
                  value={kelurahan}
                >
                  {kelurahan}
                </option>

              )
            )}

          </select>


          {/* NOMOR KAPLING */}

          <label className="
            block
            text-sm
            font-semibold
            mb-2
          ">
            Nomor Kapling Putra
          </label>

          <div className="
            w-full
            border
            rounded-lg
            p-3
            bg-white
            font-bold
            text-center
            text-xl
            text-blue-700
          ">

            {nomorKapling.putra
  ? String(
      nomorKapling.putra
    ).padStart(2, "0")
  : "-"
}

          </div>

        </div>

      )}


      {/* =================================
          PUTRI
      ================================= */}

      {selectedGudep.adaPutri && (

        <div className="
          border
          border-pink-200
          rounded-xl
          p-5
          mb-5
          bg-pink-50
        ">

          <h3 className="
            text-lg
            font-bold
            text-pink-700
            mb-4
          ">
            👩 Blok Putri
          </h3>


          {/* KECAMATAN */}

          <label className="
            block
            text-sm
            font-semibold
            mb-2
          ">
            Kecamatan
          </label>

          <input
            type="text"
            value={
              wilayahCikarangUtara.putri.kecamatan
            }
            readOnly
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-gray-100
              mb-4
            "
          />


          {/* KELURAHAN */}

          <label className="
            block
            text-sm
            font-semibold
            mb-2
          ">
            Kelurahan
          </label>

          <select
            value={
              formPenempatan.kelurahanPutri
            }
           onChange={async (e) => {

  const kelurahan =
    e.target.value;

  setFormPenempatan(prev => ({
    ...prev,

    kelurahanPutri:
      kelurahan,

  }));

  if (kelurahan) {

    await cekNomorKapling("putri");

  } else {

    setNomorKapling(prev => ({
      ...prev,
      putri: null,
    }));

  }

}}
            className="
              w-full
              border
              rounded-lg
              p-3
              bg-white
              mb-4
            "
          >

            <option value="">
              Pilih Kelurahan
            </option>

            {wilayahCikarangUtara.putri.kelurahan.map(
              (kelurahan) => (

                <option
                  key={kelurahan}
                  value={kelurahan}
                >
                  {kelurahan}
                </option>

              )
            )}

          </select>


          {/* NOMOR KAPLING */}

          <label className="
            block
            text-sm
            font-semibold
            mb-2
          ">
            Nomor Kapling Putri
          </label>

          <div className="
            w-full
            border
            rounded-lg
            p-3
            bg-white
            font-bold
            text-center
            text-xl
            text-pink-700
          ">

            {nomorKapling.putri
  ? String(
      nomorKapling.putri
    ).padStart(2, "0")
  : "-"
}

          </div>

        </div>

      )}


      {/* =================================
          TOMBOL
      ================================= */}

      <div className="
        flex
        justify-end
        gap-3
        mt-6
      ">

        <button
          onClick={() => {

            setModalOpen(false);

            setSelectedGudep(null);

          }}
          className="
            px-5
            py-3
            rounded-lg
            bg-gray-200
            hover:bg-gray-300
            font-semibold
          "
        >
          Batal
        </button>


        <button
          onClick={handleSimpanPenempatan}
          disabled={
            (selectedGudep.adaPutra &&
             !formPenempatan.kelurahanPutra)

            ||

            (selectedGudep.adaPutri &&
             !formPenempatan.kelurahanPutri)
          }
          className="
            px-5
            py-3
            rounded-lg
            bg-green-600
            hover:bg-green-700
            disabled:bg-gray-400
            text-white
            font-bold
          "
        >
          💾 Simpan Penempatan
        </button>

      </div>

    </div>

  </div>

)}

  </div>

      </div>


  );

}